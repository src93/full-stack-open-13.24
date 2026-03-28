const dummy = (blogs) => {
  return 1
}

const totalLikes = (posts) => {
  if (posts.length === 0) return 0
  return posts.reduce((acc, current) => {
    return acc += current.likes
  }, 0)
}

const favoritePost = (posts) => {
  if (posts.length === 0) return null
  const favorite = posts.reduce((acc, current) => {
    return acc.likes > current.likes ? acc : current
  }, posts[0])
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostPost = (posts) => {
  if (posts.length === 0) return null
  let name = ''
  let maxPosts = 0
  const authorWithMostposts = {}
  posts.forEach(post => {
    if (authorWithMostposts[post.author]) {
      authorWithMostposts[post.author] += 1
    } else {
      authorWithMostposts[post.author] = 1
    }
    if (authorWithMostposts[post.author] > maxPosts) {
      name = post.author
      maxPosts = authorWithMostposts[post.author]
    }
  })

  return {
    author: name,
    posts: maxPosts
  }
}

const mostLikes = (posts) => {
  if (posts.length === 0) return null
  let name = ''
  let maxLikes = 0
  const authorWithMostposts = {}
  posts.forEach(post => {
    if (authorWithMostposts[post.author]) {
      authorWithMostposts[post.author] += post.likes
    } else {
      authorWithMostposts[post.author] = post.likes
    }
    if (authorWithMostposts[post.author] > maxLikes) {
      name = post.author
      maxLikes = authorWithMostposts[post.author]
    }
  })

  return {
    author: name,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoritePost,
  mostPost,
  mostLikes
}