import Mux from '@mux/mux-node'

export function getMuxClient() {
  const tokenId = process.env.MUX_TOKEN_ID
  const tokenSecret = process.env.MUX_TOKEN_SECRET

  if (!tokenId || !tokenSecret) {
    console.warn('Mux credentials missing; live/VOD features are UNVERIFIED until configured.')
    return null
  }

  return new Mux({ tokenId, tokenSecret })
}
