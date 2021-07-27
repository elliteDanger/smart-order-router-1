import { Token } from '@uniswap/sdk-core';
import _ from 'lodash';
import { ITokenListProvider } from '../../providers/token-list-provider';
import { WETH9 } from '../../util/addresses';
import { ChainId } from '../../util/chains';

type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const BASES_TO_CHECK_TRADES_AGAINST = (
  tokenProvider: ITokenListProvider
): ChainTokenList => {
  return {
    [ChainId.MAINNET]: [
      WETH9[ChainId.MAINNET],
      tokenProvider.getTokenBySymbol('DAI')!,
      tokenProvider.getTokenBySymbol('USDC')!,
      tokenProvider.getTokenBySymbol('USDT')!,
      tokenProvider.getTokenBySymbol('WBTC')!,
    ],
    [ChainId.ROPSTEN]: [WETH9[ChainId.ROPSTEN]],
    [ChainId.RINKEBY]: [WETH9[ChainId.RINKEBY]],
    [ChainId.GÖRLI]: [WETH9[ChainId.GÖRLI]],
    [ChainId.KOVAN]: [WETH9[ChainId.KOVAN]],
  };
};

const getBasePairBySymbols = (
  tokenProvider: ITokenListProvider,
  _chainId: ChainId,
  fromSymbol: string,
  ...toSymbols: string[]
): { [tokenAddress: string]: Token[] } => {
  const fromToken: Token | undefined =
    tokenProvider.getTokenBySymbol(fromSymbol);
  const toTokens: Token[] = _(toSymbols)
    .map((toSymbol) => tokenProvider.getTokenBySymbol(toSymbol))
    .compact()
    .value();

  if (!fromToken || _.isEmpty(toTokens)) return {};

  return {
    [fromToken.address]: toTokens,
  };
};

const getBasePairByAddress = (
  tokenProvider: ITokenListProvider,
  _chainId: ChainId,
  fromAddress: string,
  toSymbol: string
): { [tokenAddress: string]: Token[] } => {
  const toToken: Token | undefined = tokenProvider.getTokenBySymbol(toSymbol);

  if (!toToken) return {};

  return {
    [fromAddress]: [toToken],
  };
};

export const ADDITIONAL_BASES = (
  tokenProvider: ITokenListProvider
): {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} => {
  return {
    [ChainId.MAINNET]: {
      ...getBasePairByAddress(
        tokenProvider,
        ChainId.MAINNET,
        '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18',
        'UNI'
      ),
      ...getBasePairByAddress(
        tokenProvider,
        ChainId.MAINNET,
        '0x561a4717537ff4AF5c687328c0f7E90a319705C0',
        'UNI'
      ),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'FEI', 'TRIBE'),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'TRIBE', 'FEI'),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'FRAX', 'FXS'),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'FXS', 'FRAX'),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'WBTC', 'renBTC'),
      ...getBasePairBySymbols(tokenProvider, ChainId.MAINNET, 'renBTC', 'WBTC'),
    },
  };
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES = (
  tokenProvider: ITokenListProvider
): {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} => {
  return {
    [ChainId.MAINNET]: {
      ...getBasePairBySymbols(
        tokenProvider,
        ChainId.MAINNET,
        'AMPL',
        'DAI',
        'ETH'
      ),
    },
  };
};
