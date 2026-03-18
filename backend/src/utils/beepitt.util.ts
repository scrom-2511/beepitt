import { discordBeep } from './discordBeep.util';
import { telegramBeep } from './telegramBeep.utils';

export const beepitt = async (discordChatIds: string[], telegramChatIds: string[]) => {
  if (telegramChatIds?.length) {
    await telegramBeep(telegramChatIds);
  }

  if (discordChatIds?.length) {
    await discordBeep(discordChatIds);
  }
};
