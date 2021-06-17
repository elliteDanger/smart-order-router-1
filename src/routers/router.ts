import { Currency, Percent, Token } from '@uniswap/sdk-core';
import { MethodParameters, Route as RouteRaw } from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers';
import { CurrencyAmount } from '../util/amounts';

export class RouteSOR extends RouteRaw<Token, Token> {}

export type RouteAmount = {
  route: RouteSOR;
  amount: CurrencyAmount; // Amount in or out from user.
  quote: CurrencyAmount;
  quoteGasAdjusted: CurrencyAmount;
  estimatedGasUsed: BigNumber;
  percentage: number;
};

export type SwapRoute = {
  quote: CurrencyAmount;
  quoteGasAdjusted: CurrencyAmount;
  estimatedGasUsed: BigNumber;
  gasPriceWei: BigNumber;
  routeAmounts: RouteAmount[];
  blockNumber: BigNumber;
  methodParameters: MethodParameters;
};

export type SwapConfig = {
  recipient: string;
  slippageTolerance: Percent;
  deadline: number;
};
export abstract class IRouter<RoutingConfig> {
  abstract routeExactIn(
    currencyIn: Currency,
    currencyOut: Currency,
    amountIn: CurrencyAmount,
    swapConfig: SwapConfig,
    routingConfig?: RoutingConfig
  ): Promise<SwapRoute | null>;

  abstract routeExactOut(
    currencyIn: Currency,
    currencyOut: Currency,
    amountOut: CurrencyAmount,
    swapConfig: SwapConfig,
    routingConfig?: RoutingConfig
  ): Promise<SwapRoute | null>;
}
