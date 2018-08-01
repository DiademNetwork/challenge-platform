import nfToken from '@/contracts/nfTokenFactory'

export default function (tokenId, web3) {
  var contract = nfToken(web3)

  return new Promise((resolve, reject) => {
    contract.then((instance) => {
      instance.getToken(tokenId).then((response) => {
        const type = response[0] === true ? 1 : 0
        const title = response[1].toString()
        const reward = parseInt(response[2])
        const verifiers = response[3]

        resolve([
          type, title, reward, verifiers
        ])
      }).catch((error) => reject)
    })
  })
}
