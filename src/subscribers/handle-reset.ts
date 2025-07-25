import { Modules } from "@medusajs/framework/utils"
import {
    SubscriberArgs,
    type SubscriberConfig,
} from "@medusajs/medusa"
  
  export default async function resetPasswordTokenHandler({
    event: { data: {
      entity_id: email,
      token,
      actor_type,
    } },
    container,
  }: SubscriberArgs<{ entity_id: string, token: string, actor_type: string }>) {
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )
  
    const urlPrefix = "https://admin-geely-shop.vercel.app"
    const url = `${urlPrefix}/reset-password?token=${token}&email=${email}`
  
    await notificationModuleService.createNotifications({
      to: email,
      channel: "email",
      template: "d-048c447310d349d29c22eaeea47a2f56",
      data: {
        user: 'Dear Customer',
        link: url,
      },
    })
  }
  
  export const config: SubscriberConfig = {
    event: "auth.password_reset",
  }