import { reactive, ref, computed } from 'vue'
import seedData from './seed.json'

function freshState() {
  return JSON.parse(JSON.stringify(seedData))
}

const state = reactive(freshState())

const currentUserId = ref(state.users[0]?.id ?? null)

export const currentUser = computed(() =>
  state.users.find((u) => u.id === currentUserId.value) ?? null
)

export function setCurrentUser(id) {
  if (!state.users.find((u) => u.id === id)) return
  currentUserId.value = id
}

export const BIO_MAX_LENGTH = 160

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

export function getDisplayName(userId) {
  const user = state.users.find((u) => u.id === userId)
  if (!user) return 'Unknown'
  return user.preferredName || user.name
}

export function getPost(id) {
  return state.posts.find((p) => p.id === id) ?? null
}

export function getComments(postId) {
  return state.comments.filter((c) => c.postId === postId)
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function createUser({ name, bio = '', preferredName = '' }) {
  const errors = []

  if (!name || !name.trim()) {
    errors.push('validation.nameRequired')
  }
  if (bio && bio.trim().length > BIO_MAX_LENGTH) {
    errors.push('validation.bioTooLong')
  }

  if (errors.length) return { user: null, errors }

  const trimmedName = name.trim()
  const base = slugify(trimmedName)
  let username = base
  let suffix = 2
  while (state.users.some((u) => u.username === username)) {
    username = `${base}-${suffix++}`
  }

  const user = {
    id: uid('user'),
    name: trimmedName,
    username,
    avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(username)}`,
    bio: bio.trim(),
    preferredName: preferredName.trim(),
  }
  state.users.push(user)
  return { user, errors: [] }
}

export function createComment({ postId, body }) {
  const errors = []

  if (!currentUserId.value) {
    errors.push('validation.noUserSelected')
  }
  if (!body || !body.trim()) {
    errors.push('validation.commentEmpty')
  }
  if (postId && !state.posts.find((p) => p.id === postId)) {
    errors.push('validation.postNotFound')
  }

  if (errors.length) return { comment: null, errors }

  const comment = {
    id: uid('comment'),
    postId,
    authorId: currentUserId.value,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  }
  state.comments.push(comment)
  return { comment, errors: [] }
}
