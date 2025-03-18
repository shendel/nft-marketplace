export function getCurrentDomain() {
  return 'localhost.nftstake'
  //return 'nftmarket.angeldao.info'
  //return 'shendel.github.io'
  //return 'avly-eneeseene-test'
  return window.location.hostname || document.location.host || ''
}