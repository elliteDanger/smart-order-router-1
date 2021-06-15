import Logger from 'bunyan';
import { providers } from 'ethers';
import { ETHGasStationInfoProvider } from '../providers/gas-price-provider';
import { Multicall2Provider } from '../providers/multicall2-provider';
import { PoolProvider } from '../providers/pool-provider';
import { QuoteProvider } from '../providers/quote-provider';
import { SubgraphProvider } from '../providers/subgraph-provider';
import { TokenProvider } from '../providers/token-provider';
import { ChainId } from '../util/chains';
import { DefaultRouter } from './default-router/default-router';
import { HeuristicGasModelFactory } from './default-router/gas-models/heuristic-gas-model';
import { MetricLogger } from './metric';
import { IRouter } from './router';
import { V3InterfaceRouter } from './v3-interface-router/v3-interface-router';

export enum RouterId {
  V3Interface = 'V3Interface',
  Default = 'Default',
}

export const ROUTER_IDS_LIST = Object.values(RouterId) as string[];

export const RouterFactory = (
  routerStr: string,
  chainId: ChainId,
  provider: providers.BaseProvider,
  tokenProvider: TokenProvider,
  log: Logger
): IRouter<any> => {
  const metricLogger = new MetricLogger(log);
  const multicall2Provider = new Multicall2Provider(provider, log);

  switch (routerStr) {
    case RouterId.Default:
      return new DefaultRouter({
        chainId,
        subgraphProvider: new SubgraphProvider(log),
        multicall2Provider: new Multicall2Provider(provider, log),
        poolProvider: new PoolProvider(multicall2Provider, log),
        quoteProvider: new QuoteProvider(multicall2Provider, log),
        gasPriceProvider: new ETHGasStationInfoProvider(log),
        gasModelFactory: new HeuristicGasModelFactory(log),
        tokenProvider,
        metricLogger,
        log,
      });
    case RouterId.V3Interface:
      return new V3InterfaceRouter({
        chainId,
        multicall2Provider,
        poolProvider: new PoolProvider(multicall2Provider, log),
        quoteProvider: new QuoteProvider(multicall2Provider, log),
        tokenProvider,
        log,
      });

    default:
      throw new Error(`Implementation of router ${routerStr} not found.`);
  }
};
