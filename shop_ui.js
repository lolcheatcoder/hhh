// File: kubejs/server_scripts/shop_ui.js
// Chat-UI Shop + Kill Rewards + Auction House
// Currency: scoreboard objective "money"

const Component = Java.loadClass('net.minecraft.network.chat.Component')
const ClickEvent = Java.loadClass('net.minecraft.network.chat.ClickEvent')
const HoverEvent = Java.loadClass('net.minecraft.network.chat.HoverEvent')

const MONEY_OBJ = 'money'
const MOB_KILL_REWARD = 10
const BOSS_KILL_REWARD = 1000

const PAGE_SIZE = 7
const AH_PAGE_SIZE = 6
const SHOP_TITLE = '§6§lServer Shop'
const AUCTION_DATA_FILE = 'kubejs/data/shop_auction_data.json'

const SHOP_SECTIONS = {
  food: {
    title: '§6§lFood Shop',
    description: 'Basic survival food and regen options.',
    icon: '🍖',
    items: {
      bread: { id: 'minecraft:bread', buy: 8, sell: 4 },
      baked_potato: { id: 'minecraft:baked_potato', buy: 7, sell: 3 },
      cooked_beef: { id: 'minecraft:cooked_beef', buy: 18, sell: 9 },
      cooked_chicken: { id: 'minecraft:cooked_chicken', buy: 14, sell: 7 },
      golden_carrot: { id: 'minecraft:golden_carrot', buy: 35, sell: 17 },
      pumpkin_pie: { id: 'minecraft:pumpkin_pie', buy: 16, sell: 8 },
      honey_bottle: { id: 'minecraft:honey_bottle', buy: 22, sell: 11 },
      suspicious_stew: { id: 'minecraft:suspicious_stew', buy: 42, sell: 21 }
    }
  },
  ores: {
    title: '§b§lOres & Gems',
    description: 'Core progression resources.',
    icon: '⛏',
    items: {
      coal: { id: 'minecraft:coal', buy: 12, sell: 6 },
      redstone: { id: 'minecraft:redstone', buy: 15, sell: 7 },
      lapis: { id: 'minecraft:lapis_lazuli', buy: 18, sell: 9 },
      iron: { id: 'minecraft:iron_ingot', buy: 35, sell: 17 },
      copper: { id: 'minecraft:copper_ingot', buy: 20, sell: 10 },
      gold: { id: 'minecraft:gold_ingot', buy: 55, sell: 27 },
      diamond: { id: 'minecraft:diamond', buy: 260, sell: 130 },
      emerald: { id: 'minecraft:emerald', buy: 220, sell: 110 },
      netherite_scrap: { id: 'minecraft:netherite_scrap', buy: 520, sell: 260 }
    }
  },
  blocks: {
    title: '§a§lBuilding Blocks',
    description: 'Cheap bulk materials for bases.',
    icon: '🧱',
    items: {
      stone: { id: 'minecraft:stone', buy: 4, sell: 2 },
      cobblestone: { id: 'minecraft:cobblestone', buy: 3, sell: 1 },
      deepslate: { id: 'minecraft:cobbled_deepslate', buy: 4, sell: 2 },
      oak_log: { id: 'minecraft:oak_log', buy: 10, sell: 5 },
      spruce_log: { id: 'minecraft:spruce_log', buy: 10, sell: 5 },
      glass: { id: 'minecraft:glass', buy: 9, sell: 4 },
      terracotta: { id: 'minecraft:terracotta', buy: 13, sell: 6 },
      bricks: { id: 'minecraft:bricks', buy: 14, sell: 7 },
      obsidian: { id: 'minecraft:obsidian', buy: 65, sell: 32 }
    }
  },
  utility: {
    title: '§d§lUtility & Combat',
    description: 'Travel, ammo, and everyday utility.',
    icon: '🛠',
    items: {
      torch: { id: 'minecraft:torch', buy: 5, sell: 2 },
      arrow: { id: 'minecraft:arrow', buy: 4, sell: 2 },
      ender_pearl: { id: 'minecraft:ender_pearl', buy: 75, sell: 37 },
      firework_rocket: { id: 'minecraft:firework_rocket', buy: 25, sell: 12 },
      experience_bottle: { id: 'minecraft:experience_bottle', buy: 45, sell: 22 },
      slime_ball: { id: 'minecraft:slime_ball', buy: 22, sell: 11 },
      blaze_rod: { id: 'minecraft:blaze_rod', buy: 30, sell: 15 },
      ghast_tear: { id: 'minecraft:ghast_tear', buy: 85, sell: 42 }
    }
  },
  farming: {
    title: '§2§lFarming & Nature',
    description: 'Seeds, crops, and plant utility materials.',
    icon: '🌾',
    items: {
      wheat_seeds: { id: 'minecraft:wheat_seeds', buy: 3, sell: 1 },
      wheat: { id: 'minecraft:wheat', buy: 6, sell: 3 },
      carrot: { id: 'minecraft:carrot', buy: 6, sell: 3 },
      potato: { id: 'minecraft:potato', buy: 6, sell: 3 },
      beetroot_seeds: { id: 'minecraft:beetroot_seeds', buy: 4, sell: 2 },
      sugar_cane: { id: 'minecraft:sugar_cane', buy: 7, sell: 3 },
      cactus: { id: 'minecraft:cactus', buy: 8, sell: 4 },
      bamboo: { id: 'minecraft:bamboo', buy: 7, sell: 3 }
    }
  },
  mob_drops: {
    title: '§c§lMob Drops',
    description: 'Common hostile mob materials.',
    icon: '☠',
    items: {
      rotten_flesh: { id: 'minecraft:rotten_flesh', buy: 8, sell: 4 },
      bone: { id: 'minecraft:bone', buy: 9, sell: 4 },
      string: { id: 'minecraft:string', buy: 10, sell: 5 },
      gunpowder: { id: 'minecraft:gunpowder', buy: 14, sell: 7 },
      spider_eye: { id: 'minecraft:spider_eye', buy: 11, sell: 5 },
      ender_eye: { id: 'minecraft:ender_eye', buy: 120, sell: 60 },
      phantom_membrane: { id: 'minecraft:phantom_membrane', buy: 45, sell: 22 },
      shulker_shell: { id: 'minecraft:shulker_shell', buy: 160, sell: 80 }
    }
  },
  redstone: {
    title: '§4§lRedstone Tech',
    description: 'Automation and circuitry components.',
    icon: '🔴',
    items: {
      repeater: { id: 'minecraft:repeater', buy: 24, sell: 12 },
      comparator: { id: 'minecraft:comparator', buy: 30, sell: 15 },
      observer: { id: 'minecraft:observer', buy: 26, sell: 13 },
      piston: { id: 'minecraft:piston', buy: 20, sell: 10 },
      sticky_piston: { id: 'minecraft:sticky_piston', buy: 32, sell: 16 },
      hopper: { id: 'minecraft:hopper', buy: 45, sell: 22 },
      dispenser: { id: 'minecraft:dispenser', buy: 28, sell: 14 },
      note_block: { id: 'minecraft:note_block', buy: 18, sell: 9 }
    }
  },
  create: {
    title: '§e§lCreate Machinery',
    description: 'Core Create components and logistics.',
    icon: '⚙',
    items: {
      andesite_alloy: { id: 'create:andesite_alloy', buy: 30, sell: 15 },
      brass_ingot: { id: 'create:brass_ingot', buy: 58, sell: 29 },
      zinc_ingot: { id: 'create:zinc_ingot', buy: 28, sell: 14 },
      shaft: { id: 'create:shaft', buy: 14, sell: 7 },
      cogwheel: { id: 'create:cogwheel', buy: 16, sell: 8 },
      large_cogwheel: { id: 'create:large_cogwheel', buy: 28, sell: 14 },
      mechanical_bearing: { id: 'create:mechanical_bearing', buy: 85, sell: 42 },
      belt_connector: { id: 'create:belt_connector', buy: 24, sell: 12 },
      precision_mechanism: { id: 'create:precision_mechanism', buy: 240, sell: 120 },
      electron_tube: { id: 'create:electron_tube', buy: 55, sell: 27 }
    }
  },
  apotheosis: {
    title: '§5§lApotheosis Loot',
    description: 'Affix/gem progression materials and tools.',
    icon: '✦',
    items: {
      gem_dust: { id: 'apotheosis:gem_dust', buy: 95, sell: 47 },
      gem_fused_slate: { id: 'apotheosis:gem_fused_slate', buy: 140, sell: 70 },
      salvaging_table: { id: 'apotheosis:salvaging_table', buy: 550, sell: 275 },
      reforging_table: { id: 'apotheosis:reforging_table', buy: 700, sell: 350 },
      socketing_table: { id: 'apotheosis:socketing_table', buy: 760, sell: 380 },
      boss_summoner: { id: 'apotheosis:boss_summoner', buy: 1000, sell: 500 },
      mythic_material: { id: 'apotheosis:mythic_material', buy: 260, sell: 130 },
      uncommon_material: { id: 'apotheosis:uncommon_material', buy: 70, sell: 35 }
    }
  }
}

const SECTION_ORDER = [
  'food',
  'ores',
  'blocks',
  'utility',
  'farming',
  'mob_drops',
  'redstone',
  'create',
  'apotheosis'
]

const SHOP = {}
Object.entries(SHOP_SECTIONS).forEach(([section, sectionData]) => {
  Object.entries(sectionData.items).forEach(([key, item]) => {
    SHOP[key] = { ...item, section }
  })
})

// ===== Auction House Runtime State =====
let NEXT_AUCTION_ID = 1
const AUCTIONS = []
const PENDING_PAYOUTS = {}

function resetAuctionRuntime() {
  NEXT_AUCTION_ID = 1
  AUCTIONS.length = 0
  Object.keys(PENDING_PAYOUTS).forEach(key => delete PENDING_PAYOUTS[key])
}

function saveAuctionData() {
  const payload = {
    nextAuctionId: NEXT_AUCTION_ID,
    auctions: AUCTIONS,
    pendingPayouts: PENDING_PAYOUTS
  }

  try {
    JsonIO.write(AUCTION_DATA_FILE, payload)
  } catch (err) {
    console.error(`[shop_ui] Failed to save auction data: ${err}`)
  }
}

function loadAuctionData() {
  resetAuctionRuntime()

  try {
    const raw = JsonIO.read(AUCTION_DATA_FILE)
    if (!raw) return

    const nextId = Number(raw.nextAuctionId || 1)
    NEXT_AUCTION_ID = nextId > 1 ? Math.floor(nextId) : 1

    if (Array.isArray(raw.auctions)) {
      raw.auctions.forEach(a => {
        if (!a || !a.id || !a.itemId || !a.amount || !a.price || !a.sellerId) return
        AUCTIONS.push({
          id: Math.floor(Number(a.id)),
          sellerId: `${a.sellerId}`,
          sellerName: `${a.sellerName || 'Unknown'}`,
          itemId: `${a.itemId}`,
          amount: clampAmount(Number(a.amount)),
          price: clampPrice(Number(a.price)),
          createdAt: Number(a.createdAt || Date.now())
        })
      })
    }

    const payouts = raw.pendingPayouts || {}
    Object.entries(payouts).forEach(([pid, amount]) => {
      const n = Math.floor(Number(amount || 0))
      if (n > 0) PENDING_PAYOUTS[`${pid}`] = n
    })

    const maxId = AUCTIONS.reduce((max, a) => Math.max(max, a.id), 0)
    if (NEXT_AUCTION_ID <= maxId) NEXT_AUCTION_ID = maxId + 1
  } catch (err) {
    console.error(`[shop_ui] Failed to load auction data: ${err}`)
  }
}

function playerId(player) {
  return `${player.uuid}`
}

function getMoney(player) {
  return player.score(MONEY_OBJ) ?? 0
}

function btn(label, cmd, hoverText) {
  return Component.literal(label).withStyle(style =>
    style
      .withClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, cmd))
      .withHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, Component.literal(hoverText)))
      .withUnderlined(true)
  )
}

function clampAmount(n) {
  n = n | 0
  if (n < 1) return 1
  if (n > 64 * 27) return 64 * 27
  return n
}

function clampPrice(n) {
  n = n | 0
  if (n < 1) return 1
  if (n > 1000000000) return 1000000000
  return n
}

function clampPage(page, totalItems, pageSize) {
  page = page | 0
  if (page < 1) page = 1
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (page > totalPages) page = totalPages
  return page
}

function paginateEntries(entries, page, pageSize) {
  const safePage = clampPage(page, entries.length, pageSize)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize
  return {
    entries: entries.slice(start, end),
    total: entries.length,
    page: safePage,
    totalPages: Math.max(1, Math.ceil(entries.length / pageSize))
  }
}

function shopStats(items) {
  const values = Object.values(items)
  const count = values.length
  if (!count) return { count: 0, avgBuy: 0, avgSell: 0, cheapest: 0, mostExpensive: 0 }

  const totalBuy = values.reduce((acc, v) => acc + v.buy, 0)
  const totalSell = values.reduce((acc, v) => acc + v.sell, 0)
  const cheapest = values.reduce((min, v) => Math.min(min, v.buy), values[0].buy)
  const mostExpensive = values.reduce((max, v) => Math.max(max, v.buy), values[0].buy)

  return {
    count,
    avgBuy: Math.floor(totalBuy / count),
    avgSell: Math.floor(totalSell / count),
    cheapest,
    mostExpensive
  }
}

function lineFor(key, data) {
  const base = Component.literal(
    `• ${key} §8(${data.id}) §7(Buy:§f ${data.buy} §7Sell:§f ${data.sell}§7) `
  )

  const buy1 = btn('§a[Buy 1]', `/buy ${key} 1`, `Buy 1 for ${data.buy}`)
  const buy16 = btn('§a[Buy 16]', `/buy ${key} 16`, `Buy 16 for ${data.buy * 16}`)
  const buy64 = btn('§2[Buy 64]', `/buy ${key} 64`, `Buy 64 for ${data.buy * 64}`)
  const sell1 = btn('§c[Sell 1]', `/sell ${key} 1`, `Sell 1 for ${data.sell}`)
  const sell16 = btn('§c[Sell 16]', `/sell ${key} 16`, `Sell 16 for ${data.sell * 16}`)
  const sell64 = btn('§4[Sell 64]', `/sell ${key} 64`, `Sell 64 for ${data.sell * 64}`)

  return base
    .append(buy1).append(Component.literal(' '))
    .append(buy16).append(Component.literal(' '))
    .append(buy64).append(Component.literal('  '))
    .append(sell1).append(Component.literal(' '))
    .append(sell16).append(Component.literal(' '))
    .append(sell64)
}

function tellNavigation(player, nav) {
  const row = Component.literal('§8» ')
  if (nav.backCmd) row.append(btn('§e[Back]', nav.backCmd, 'Go back'))
  if (nav.homeCmd) row.append(Component.literal(' ')).append(btn('§6[Home]', nav.homeCmd, 'Go to shop home'))
  if (nav.prevCmd) row.append(Component.literal(' ')).append(btn('§b[Prev]', nav.prevCmd, 'Previous page'))
  if (nav.nextCmd) row.append(Component.literal(' ')).append(btn('§b[Next]', nav.nextCmd, 'Next page'))
  if (nav.refreshCmd) row.append(Component.literal(' ')).append(btn('§a[Refresh]', nav.refreshCmd, 'Refresh this page'))
  player.tell(row)
}

function showShopHome(player, page) {
  const orderedSections = SECTION_ORDER
    .filter(key => SHOP_SECTIONS[key])
    .map(key => [key, SHOP_SECTIONS[key]])

  const paged = paginateEntries(orderedSections, page, PAGE_SIZE)
  player.tell(Component.literal(`${SHOP_TITLE} §7(organized by section)`))
  player.tell(Component.literal(`§7Balance: §e${getMoney(player)} money`))
  player.tell(Component.literal(`§7Sections page §f${paged.page}§7/§f${paged.totalPages}`))

  paged.entries.forEach(([sectionKey, section]) => {
    const stats = shopStats(section.items)
    player.tell(
      Component.literal('• ')
        .append(btn(`§a[${section.icon} ${sectionKey.toUpperCase()}]`, `/shop section ${sectionKey} 1`, `Open ${sectionKey}`))
        .append(Component.literal(` §7(${stats.count} items, avg buy: §f${stats.avgBuy}§7)`))
    )
    player.tell(Component.literal(`  §8${section.description}`))
  })

  tellNavigation(player, {
    homeCmd: '/shop 1',
    prevCmd: paged.page > 1 ? `/shop ${paged.page - 1}` : null,
    nextCmd: paged.page < paged.totalPages ? `/shop ${paged.page + 1}` : null,
    refreshCmd: `/shop ${paged.page}`
  })

  player.tell(Component.literal('§8Tip: §7/shop section <name> <page>, /shop search <text> <page>, /shop balance, /ah'))
}

function showShopSection(player, sectionKey, page) {
  const section = SHOP_SECTIONS[sectionKey]
  if (!section) {
    player.tell(Component.literal(`§cUnknown section: §f${sectionKey}`))
    return showShopHome(player, 1)
  }

  const paged = paginateEntries(Object.entries(section.items), page, PAGE_SIZE)
  const stats = shopStats(section.items)

  player.tell(Component.literal(`${section.title} §7(Page §f${paged.page}§7/§f${paged.totalPages}§7)`))
  player.tell(Component.literal(`§7Balance: §e${getMoney(player)} money`))
  player.tell(Component.literal(`§7Items: §f${stats.count} §7| Avg Buy: §f${stats.avgBuy} §7| Cheapest: §f${stats.cheapest} §7| Highest: §f${stats.mostExpensive}`))

  paged.entries.forEach(([key, data]) => player.tell(lineFor(key, data)))

  tellNavigation(player, {
    backCmd: '/shop 1',
    homeCmd: '/shop 1',
    prevCmd: paged.page > 1 ? `/shop section ${sectionKey} ${paged.page - 1}` : null,
    nextCmd: paged.page < paged.totalPages ? `/shop section ${sectionKey} ${paged.page + 1}` : null,
    refreshCmd: `/shop section ${sectionKey} ${paged.page}`
  })
}

function showSearchResults(player, searchTerm, page) {
  const query = `${searchTerm || ''}`.trim().toLowerCase()
  if (!query) return player.tell(Component.literal('§cSearch term cannot be empty.'))

  const matches = Object.entries(SHOP).filter(([key, entry]) =>
    key.includes(query) || entry.id.includes(query) || entry.section.includes(query)
  )

  const paged = paginateEntries(matches, page, PAGE_SIZE)
  player.tell(Component.literal(`§3§lSearch Results §7for: §f${query}`))
  player.tell(Component.literal(`§7Matches: §f${paged.total} §7| Page: §f${paged.page}§7/§f${paged.totalPages}`))

  if (!paged.total) {
    player.tell(Component.literal('§cNo shop items matched your query.'))
    return tellNavigation(player, { homeCmd: '/shop 1', refreshCmd: `/shop search ${query} 1` })
  }

  paged.entries.forEach(([key, data]) => {
    const sectionTag = Component.literal(`§8[${data.section}] `)
    player.tell(sectionTag.append(lineFor(key, data)))
  })

  tellNavigation(player, {
    backCmd: '/shop 1',
    homeCmd: '/shop 1',
    prevCmd: paged.page > 1 ? `/shop search ${query} ${paged.page - 1}` : null,
    nextCmd: paged.page < paged.totalPages ? `/shop search ${query} ${paged.page + 1}` : null,
    refreshCmd: `/shop search ${query} ${paged.page}`
  })
}

function removeItemsOrFail(player, itemId, amount) {
  const stack = Item.of(itemId)
  const removed = player.inventory.clear(stack, amount)
  if (removed < amount) {
    if (removed > 0) player.give(Item.of(itemId, removed))
    return false
  }
  return true
}

function buy(player, key, amount) {
  const entry = SHOP[key]
  if (!entry) return player.tell(`§cUnknown item key: §f${key}`)

  amount = clampAmount(amount)
  const cost = entry.buy * amount

  if (getMoney(player) < cost) {
    return player.tell(`§cNot enough money. Need §e${cost}§c.`)
  }

  player.give(Item.of(entry.id, amount))
  player.addScore(MONEY_OBJ, -cost)
  player.tell(`§aBought §f${amount}x ${key}§a for §e${cost}`)
}

function sell(player, key, amount) {
  const entry = SHOP[key]
  if (!entry) return player.tell(`§cUnknown item key: §f${key}`)

  amount = clampAmount(amount)
  const payout = entry.sell * amount

  if (!removeItemsOrFail(player, entry.id, amount)) {
    return player.tell(`§cYou don't have §f${amount}x ${key}§c.`)
  }

  player.addScore(MONEY_OBJ, payout)
  player.tell(`§aSold §f${amount}x ${key}§a for §e${payout}`)
}

function showBalance(player) {
  player.tell(Component.literal(`§6Your balance: §e${getMoney(player)} money`))
}

function findAuctionById(id) {
  return AUCTIONS.find(a => a.id === id)
}

function myAuctionCount(player) {
  const id = playerId(player)
  return AUCTIONS.filter(a => a.sellerId === id).length
}

function showAuctionHouse(player, page) {
  const sorted = [...AUCTIONS].sort((a, b) => a.id - b.id)
  const paged = paginateEntries(sorted, page, AH_PAGE_SIZE)

  player.tell(Component.literal('§6§lAuction House'))
  player.tell(Component.literal(`§7Balance: §e${getMoney(player)} money §8| §7Listings: §f${paged.total} §8| §7Yours: §f${myAuctionCount(player)}`))

  if (!paged.total) {
    player.tell(Component.literal('§7No active auctions. Create one with §f/ah sell <item_id> <amount> <price>'))
  } else {
    paged.entries.forEach(listing => {
      const line = Component.literal(
        `• #${listing.id} §f${listing.amount}x ${listing.itemId} §7Price: §e${listing.price} §8Seller: §7${listing.sellerName} `
      )
      line.append(btn('§a[Buy]', `/ah buy ${listing.id}`, `Buy listing #${listing.id}`))
      if (listing.sellerId === playerId(player)) {
        line.append(Component.literal(' ')).append(btn('§c[Cancel]', `/ah cancel ${listing.id}`, 'Cancel your listing'))
      }
      player.tell(line)
    })
  }

  tellNavigation(player, {
    homeCmd: '/ah 1',
    prevCmd: paged.page > 1 ? `/ah ${paged.page - 1}` : null,
    nextCmd: paged.page < paged.totalPages ? `/ah ${paged.page + 1}` : null,
    refreshCmd: `/ah ${paged.page}`
  })
  player.tell(Component.literal('§8Commands: §7/ah sell <item_id> <amount> <price>, /ah buy <id>, /ah my, /ah cancel <id>'))
}

function createAuction(player, itemId, amount, price) {
  amount = clampAmount(amount)
  price = clampPrice(price)

  if (!removeItemsOrFail(player, itemId, amount)) {
    return player.tell(`§cYou do not have §f${amount}x ${itemId}§c.`)
  }

  const listing = {
    id: NEXT_AUCTION_ID++,
    sellerId: playerId(player),
    sellerName: player.name.string,
    itemId,
    amount,
    price,
    createdAt: Date.now()
  }

  AUCTIONS.push(listing)
  saveAuctionData()
  player.tell(`§aAuction created! §7#${listing.id} §f${amount}x ${itemId} §7for §e${price} money`)
}

function buyAuction(player, listingId) {
  listingId = listingId | 0
  const listing = findAuctionById(listingId)
  if (!listing) return player.tell(`§cAuction #${listingId} not found.`)

  if (listing.sellerId === playerId(player)) {
    return player.tell('§cYou cannot buy your own listing.')
  }

  if (getMoney(player) < listing.price) {
    return player.tell(`§cNot enough money. Need §e${listing.price}§c.`)
  }

  player.addScore(MONEY_OBJ, -listing.price)
  player.give(Item.of(listing.itemId, listing.amount))

  PENDING_PAYOUTS[listing.sellerId] = (PENDING_PAYOUTS[listing.sellerId] || 0) + listing.price

  const index = AUCTIONS.findIndex(a => a.id === listing.id)
  if (index >= 0) AUCTIONS.splice(index, 1)

  saveAuctionData()
  player.tell(`§aPurchased auction #${listing.id}: §f${listing.amount}x ${listing.itemId} §7for §e${listing.price}`)
}

function cancelAuction(player, listingId) {
  listingId = listingId | 0
  const listing = findAuctionById(listingId)
  if (!listing) return player.tell(`§cAuction #${listingId} not found.`)

  if (listing.sellerId !== playerId(player)) {
    return player.tell('§cYou can only cancel your own listings.')
  }

  player.give(Item.of(listing.itemId, listing.amount))
  const index = AUCTIONS.findIndex(a => a.id === listing.id)
  if (index >= 0) AUCTIONS.splice(index, 1)

  saveAuctionData()
  player.tell(`§eCancelled auction #${listing.id} and returned §f${listing.amount}x ${listing.itemId}`)
}

function showMyAuctions(player) {
  const mine = AUCTIONS.filter(a => a.sellerId === playerId(player))
  player.tell(Component.literal(`§6§lMy Auctions §7(${mine.length})`))

  if (!mine.length) {
    player.tell(Component.literal('§7You do not have active auctions.'))
    return
  }

  mine.forEach(listing => {
    player.tell(
      Component.literal(`• #${listing.id} §f${listing.amount}x ${listing.itemId} §7Price: §e${listing.price} `)
        .append(btn('§c[Cancel]', `/ah cancel ${listing.id}`, 'Cancel listing'))
    )
  })
}

function collectPendingPayout(player) {
  const id = playerId(player)
  const payout = PENDING_PAYOUTS[id] || 0
  if (payout <= 0) return

  delete PENDING_PAYOUTS[id]
  saveAuctionData()
  player.addScore(MONEY_OBJ, payout)
  player.tell(`§6Auction payout received: §e${payout} money§7. New balance: §e${getMoney(player)}`)
}

function isBossEntity(entity) {
  if (!entity) return false
  if (typeof entity.isBoss === 'function') return entity.isBoss()

  const entityId = `${entity.type || ''}`
  return entityId === 'minecraft:ender_dragon' || entityId === 'minecraft:wither'
}

ServerEvents.loaded(event => {
  event.server.runCommandSilent(`scoreboard objectives add ${MONEY_OBJ} dummy`)
  loadAuctionData()
})

PlayerEvents.loggedIn(event => {
  collectPendingPayout(event.player)
})

ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  event.register(
    Commands.literal('shop')
      .executes(ctx => {
        const p = ctx.source.player
        if (!p) return 0
        showShopHome(p, 1)
        return 1
      })
      .then(Commands.argument('page', Arguments.INTEGER.create(event))
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          showShopHome(p, Arguments.INTEGER.getResult(ctx, 'page'))
          return 1
        })
      )
      .then(Commands.literal('section')
        .then(Commands.argument('name', Arguments.STRING.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            showShopSection(p, Arguments.STRING.getResult(ctx, 'name').toLowerCase(), 1)
            return 1
          })
          .then(Commands.argument('page', Arguments.INTEGER.create(event))
            .executes(ctx => {
              const p = ctx.source.player
              if (!p) return 0
              showShopSection(
                p,
                Arguments.STRING.getResult(ctx, 'name').toLowerCase(),
                Arguments.INTEGER.getResult(ctx, 'page')
              )
              return 1
            })
          )
        )
      )
      .then(Commands.literal('search')
        .then(Commands.argument('term', Arguments.STRING.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            showSearchResults(p, Arguments.STRING.getResult(ctx, 'term'), 1)
            return 1
          })
          .then(Commands.argument('page', Arguments.INTEGER.create(event))
            .executes(ctx => {
              const p = ctx.source.player
              if (!p) return 0
              showSearchResults(p, Arguments.STRING.getResult(ctx, 'term'), Arguments.INTEGER.getResult(ctx, 'page'))
              return 1
            })
          )
        )
      )
      .then(Commands.literal('sections')
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          showShopHome(p, 1)
          return 1
        })
      )
      .then(Commands.literal('balance')
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          showBalance(p)
          return 1
        })
      )
  )

  event.register(
    Commands.literal('ah')
      .executes(ctx => {
        const p = ctx.source.player
        if (!p) return 0
        showAuctionHouse(p, 1)
        return 1
      })
      .then(Commands.argument('page', Arguments.INTEGER.create(event))
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          showAuctionHouse(p, Arguments.INTEGER.getResult(ctx, 'page'))
          return 1
        })
      )
      .then(Commands.literal('sell')
        .then(Commands.argument('item', Arguments.STRING.create(event))
          .then(Commands.argument('amount', Arguments.INTEGER.create(event))
            .then(Commands.argument('price', Arguments.INTEGER.create(event))
              .executes(ctx => {
                const p = ctx.source.player
                if (!p) return 0
                createAuction(
                  p,
                  Arguments.STRING.getResult(ctx, 'item'),
                  Arguments.INTEGER.getResult(ctx, 'amount'),
                  Arguments.INTEGER.getResult(ctx, 'price')
                )
                return 1
              })
            )
          )
        )
      )
      .then(Commands.literal('buy')
        .then(Commands.argument('id', Arguments.INTEGER.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            buyAuction(p, Arguments.INTEGER.getResult(ctx, 'id'))
            return 1
          })
        )
      )
      .then(Commands.literal('cancel')
        .then(Commands.argument('id', Arguments.INTEGER.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            cancelAuction(p, Arguments.INTEGER.getResult(ctx, 'id'))
            return 1
          })
        )
      )
      .then(Commands.literal('my')
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          showMyAuctions(p)
          return 1
        })
      )
  )

  event.register(
    Commands.literal('buy')
      .then(Commands.argument('item', Arguments.STRING.create(event))
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          buy(p, Arguments.STRING.getResult(ctx, 'item'), 1)
          return 1
        })
        .then(Commands.argument('amount', Arguments.INTEGER.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            buy(p,
              Arguments.STRING.getResult(ctx, 'item'),
              Arguments.INTEGER.getResult(ctx, 'amount')
            )
            return 1
          })
        )
      )
  )

  event.register(
    Commands.literal('sell')
      .then(Commands.argument('item', Arguments.STRING.create(event))
        .executes(ctx => {
          const p = ctx.source.player
          if (!p) return 0
          sell(p, Arguments.STRING.getResult(ctx, 'item'), 1)
          return 1
        })
        .then(Commands.argument('amount', Arguments.INTEGER.create(event))
          .executes(ctx => {
            const p = ctx.source.player
            if (!p) return 0
            sell(p,
              Arguments.STRING.getResult(ctx, 'item'),
              Arguments.INTEGER.getResult(ctx, 'amount')
            )
            return 1
          })
        )
      )
  )
})

EntityEvents.death(event => {
  const source = event.source
  if (!source) return
  const player = source.player
  if (!player) return

  const killed = event.entity
  const reward = isBossEntity(killed) ? BOSS_KILL_REWARD : MOB_KILL_REWARD

  player.addScore(MONEY_OBJ, reward)
  player.tell(`§6+${reward} money for kill! §7Balance: §e${getMoney(player)}`)
})
