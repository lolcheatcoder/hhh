
// File: kubejs/server_scripts/shop_ui.js
// Chat-UI Shop + Kill Rewards
// Currency: scoreboard objective "money"
// Create once: /scoreboard objectives add money dummy

const Component = Java.loadClass('net.minecraft.network.chat.Component')
const ClickEvent = Java.loadClass('net.minecraft.network.chat.ClickEvent')
const HoverEvent = Java.loadClass('net.minecraft.network.chat.HoverEvent')

const MONEY_OBJ = 'money'
const KILL_REWARD = 100  // Coins per kill

// ================= SHOP ITEMS =================
const SHOP = {
  stone:   { id: 'minecraft:stone',       buy: 2,   sell: 1 },
  bread:   { id: 'minecraft:bread',       buy: 5,   sell: 2 },
  iron:    { id: 'minecraft:iron_ingot',  buy: 25,  sell: 12 },
  diamond: { id: 'minecraft:diamond',     buy: 250, sell: 125 }
}

// ================= UI HELPERS =================
function btn(label, cmd, hoverText) {
  return Component.literal(label).withStyle(style =>
    style
      .withClickEvent(new ClickEvent(ClickEvent.Action.RUN_COMMAND, cmd))
      .withHoverEvent(new HoverEvent(HoverEvent.Action.SHOW_TEXT, Component.literal(hoverText)))
      .withUnderlined(true)
  )
}

function lineFor(key, data) {
  const base = Component.literal(
    `• ${key} §7(Buy:§f ${data.buy} §7Sell:§f ${data.sell}§7) `
  )

  const buy1  = btn('§a[Buy 1]',  `/buy ${key} 1`,  `Buy 1 for ${data.buy}`)
  const buy16 = btn('§a[Buy 16]', `/buy ${key} 16`, `Buy 16 for ${data.buy * 16}`)
  const sell1  = btn('§c[Sell 1]',  `/sell ${key} 1`,  `Sell 1 for ${data.sell}`)
  const sell16 = btn('§c[Sell 16]', `/sell ${key} 16`, `Sell 16 for ${data.sell * 16}`)

  return base
    .append(buy1).append(Component.literal(' '))
    .append(buy16).append(Component.literal('  '))
    .append(sell1).append(Component.literal(' '))
    .append(sell16)
}

function showShop(player) {
  player.tell(Component.literal('§6§lShop §7(click buttons)'))
  player.tell(Component.literal(`§7Balance: §e${player.score(MONEY_OBJ)}`))
  player.tell(Component.literal(' '))
  Object.entries(SHOP).forEach(([key, data]) => player.tell(lineFor(key, data)))
}

function clampAmount(n) {
  n = (n | 0)
  if (n < 1) return 1
  if (n > 64 * 27) return 64 * 27
  return n
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

// ================= SHOP LOGIC =================
function buy(player, key, amount) {
  const entry = SHOP[key]
  if (!entry) return player.tell(`§cUnknown item key: §f${key}`)

  amount = clampAmount(amount)
  const cost = entry.buy * amount

  if (player.score(MONEY_OBJ) < cost) {
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
    return player.tell(`§cYou don’t have §f${amount}x ${key}§c.`)
  }

  player.addScore(MONEY_OBJ, payout)
  player.tell(`§aSold §f${amount}x ${key}§a for §e${payout}`)
}

// ================= COMMANDS =================
ServerEvents.commandRegistry(event => {
  const { commands: Commands, arguments: Arguments } = event

  event.register(
    Commands.literal('shop')
      .executes(ctx => {
        const p = ctx.source.player
        if (!p) return 0
        showShop(p)
        return 1
      })
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

// ================= KILL REWARD =================
// Gives 100 coins when a player kills any entity
EntityEvents.death(event => {
  const source = event.source
  if (!source) return
  const player = source.player
  if (!player) return

  player.addScore(MONEY_OBJ, KILL_REWARD)
  player.tell(`§6+${KILL_REWARD} coins for kill! §7Balance: §e${player.score(MONEY_OBJ)}`)
})
