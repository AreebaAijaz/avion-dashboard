export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// export const token  = assertValue(
//   process.env.SANITY_API_TOKEN,
//   'Missing environment variable: SANITY_API_TOKEN'
// )

export const token = "skyFcNwhPrOA1RRfrfCt0xaZll2Cd9TxvocEdEUSJ06ek3p9WHCcvJaMHarXSK8TGEHVUinkfNOwglLcujPMfckC8gNEtHC1s5joATBsRxtpX8TcxP2Qj7WLs85dBS8hdFNf9tHmrXWltCbuRADFzCihUf2k4hV1PTDq101yiQHjjMzik1AU"
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
