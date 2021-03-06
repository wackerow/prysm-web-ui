import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WalletResponse } from 'src/app/proto/validator/accounts/v2/web_api';

@Component({
  selector: 'app-wallet-config',
  templateUrl: './wallet-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConfigComponent {
  @Input() wallet: WalletResponse | null = null;
  constructor() {}
}
