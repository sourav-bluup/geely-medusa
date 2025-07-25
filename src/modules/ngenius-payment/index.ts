import { ModuleProvider, Modules } from '@medusajs/framework/utils';
import NgeniusPaymentProviderService from './service';

export default ModuleProvider(Modules.PAYMENT, {
  services: [NgeniusPaymentProviderService],
});
