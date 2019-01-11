export default class {
  constructor(bot, regex) {
    this.bot = bot;
    this.bot.onText(regex, this.onMessage.bind(this));
  }
}
