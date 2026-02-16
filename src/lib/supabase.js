/**
 * Supabase Client
 * Подключение к локальной или облачной базе данных Robin Food
 */
import { createClient } from '@supabase/supabase-js';

// Локальная разработка (Docker)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:9000';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Синхронизация товаров с базой данных
 * @param {Array} products - Массив товаров для сохранения
 * @param {Object} store - Магазин
 * @returns {Promise<Object>} Результат операции
 */
export async function syncProductsToDatabase(products, store) {
  try {
    // Сначала получаем или создаём бизнес (сеть)
    const chainName = getChainFullName(store.chain);
    let { data: business, error: bizError } = await supabase
      .from('businesses')
      .select('id')
      .eq('name', chainName)
      .single();
    
    if (bizError && bizError.code === 'PGRST116') {
      // Бизнес не найден, создаём
      const { data: newBiz, error: createError } = await supabase
        .from('businesses')
        .insert({ name: chainName })
        .select('id')
        .single();
      
      if (createError) throw createError;
      business = newBiz;
    } else if (bizError) {
      throw bizError;
    }

    // Получаем или создаём кампанию (магазин)
    let { data: campaign, error: campError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('business_id', business.id)
      .eq('name', `${store.name} - ${store.address}`)
      .single();
    
    if (campError && campError.code === 'PGRST116') {
      const { data: newCamp, error: createError } = await supabase
        .from('campaigns')
        .insert({
          business_id: business.id,
          name: `${store.name} - ${store.address}`,
          selling_program: 'FBS'
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      campaign = newCamp;
    } else if (campError) {
      throw campError;
    }

    // Получаем или создаём склад
    let { data: warehouse, error: whError } = await supabase
      .from('warehouses')
      .select('id')
      .eq('campaign_id', campaign.id)
      .single();
    
    if (whError && whError.code === 'PGRST116') {
      const { data: newWh, error: createError } = await supabase
        .from('warehouses')
        .insert({
          campaign_id: campaign.id,
          name: store.address,
          address: store.address,
          city: 'Москва',
          latitude: store.lat,
          longitude: store.lng,
          is_main: true,
          is_active: true
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      warehouse = newWh;
    } else if (whError) {
      throw whError;
    }

    // Синхронизируем товары
    for (const product of products) {
      // Получаем или создаём оффер
      let { data: offer, error: offerError } = await supabase
        .from('offers')
        .select('id')
        .eq('business_id', business.id)
        .eq('offer_id', product.id.toString())
        .single();
      
      if (offerError && offerError.code === 'PGRST116') {
        // Создаём оффер
        const { data: newOffer, error: createError } = await supabase
          .from('offers')
          .insert({
            business_id: business.id,
            offer_id: product.id.toString(),
            name: product.name,
            vendor: product.brand || chainName,
            pictures: JSON.stringify([product.image]),
            weight: product.weight || null,
            shelf_life_value: product.shelfLife || 7,
            shelf_life_unit: 'DAY',
            is_active: true
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        offer = newOffer;
      } else if (offerError) {
        throw offerError;
      }

      // Обновляем или создаём цену
      const { error: priceError } = await supabase
        .from('offer_prices')
        .upsert({
          offer_id: offer.id,
          campaign_id: campaign.id,
          value: product.currentPrice || product.price,
          discount_base: product.originalPrice || product.price,
          currency: 'RUR',
          vat: 'VAT_10'
        }, {
          onConflict: 'offer_id,campaign_id'
        });
      
      if (priceError) throw priceError;

      // Обновляем или создаём остатки
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + (product.daysLeft || 3));
      
      const { error: stockError } = await supabase
        .from('stocks')
        .upsert({
          offer_id: offer.id,
          warehouse_id: warehouse.id,
          available_count: product.quantity || 10,
          fit_count: product.quantity || 10,
          expiration_date: expirationDate.toISOString().split('T')[0]
        }, {
          onConflict: 'offer_id,warehouse_id'
        });
      
      if (stockError) throw stockError;
    }

    console.log(`✅ Synced ${products.length} products to store ${store.address}`);
    return { success: true, count: products.length };
  } catch (error) {
    console.error('❌ Error syncing products:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Получить полное название сети
 */
function getChainFullName(chainId) {
  const names = {
    magnit: 'Магнит',
    pyaterochka: 'Пятёрочка',
    vkusvill: 'ВкусВилл'
  };
  return names[chainId] || chainId;
}

/**
 * Проверка подключения к базе данных
 */
export async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase.from('businesses').select('id').limit(1);
    if (error) throw error;
    return { connected: true };
  } catch (error) {
    console.warn('Database not available:', error.message);
    return { connected: false, error: error.message };
  }
}
