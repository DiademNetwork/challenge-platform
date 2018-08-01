const TOKEN_TYPE_IMAGE_URLS = [
  '/images/token-images/personal_challenge.png',
  '/images/token-images/community_challenge.png'
]

const TOKEN_TYPE_IMAGE_URLS_SMALL = [
  '/images/token-images/personal_challenge_small.png',
  '/images/token-images/community_challenge_small.png'
]

export default function (tokenType, size) {
  switch (size) {
    case 'small':
      return TOKEN_TYPE_IMAGE_URLS_SMALL[tokenType]
    default:
      return TOKEN_TYPE_IMAGE_URLS[tokenType]
  }
}
