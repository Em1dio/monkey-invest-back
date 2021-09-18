import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class ValidWalletGuard implements CanActivate {
  constructor(private readonly walletsService: WalletsService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user.username;
    const walletId = request.headers.walletid;

    return this.walletsService.validateWallet(walletId, user);
  }
}
