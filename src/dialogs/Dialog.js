export default class {
  constructor(bot, regex) {
    this.bot = bot;
    this.bot.onText(regex, this.onMessage.bind(this));

    if (this.onCallback) {
      this.bot.on("callback_query", q => {
        const data = JSON.parse(q.data)
        if (this.constructor.name === data.dialog) {
          const onCallback = this.onCallback.bind(this)
          onCallback(q, data)
        }
      });
    }
  }
}
