import { reactive } from 'vue'
import seedData from './seed.json'

function freshState() {
  return JSON.parse(JSON.stringify(seedData))
}

const state = reactive(freshState())

let nextId = 1000

function uid(prefix) {
  return `${prefix}-${++nextId}`
}

export function getUsers() {
  return state.users
}

export function getUser(id) {
  return state.users.find((u) => u.id === id) ?? null
}

export function getPost(id) {
  return state.posts.find((p) => p.id === id) ?? null
}

export function getComments(postId) {
  return state.comments.filter((c) => c.postId === postId)
}

export function createUser({ name, username, bio = '' }) {
  const user = {
    id: uid('user'),
    name,
    username,
    avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`,
    bio,
  }
  state.users.push(user)
  return user
}

export function createComment({ postId, authorId, body }) {
  const comment = {
    id: uid('comment'),
    postId,
    authorId,
    body,
    createdAt: new Date().toISOString(),
  }
  state.comments.push(comment)
  return comment
}
