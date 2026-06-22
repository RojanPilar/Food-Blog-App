import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

// ── Lazy-loaded views ──────────────────────────────────────────────────────────
const HomeView       = () => import("@/views/HomeView.vue");
const LoginView      = () => import("@/views/LoginView.vue");
const RegisterView   = () => import("@/views/RegisterView.vue");
const PostDetailView = () => import("@/views/PostDetailView.vue");
const CreatePostView = () => import("@/views/CreatePostView.vue");
const EditPostView   = () => import("@/views/EditPostView.vue");
const MyPostsView    = () => import("@/views/MyPostsView.vue");
const NotFoundView   = () => import("@/views/NotFoundView.vue");

const routes = [
  { path: "/",                  component: HomeView,       meta: { title: "Home" } },
  { path: "/login",             component: LoginView,      meta: { title: "Sign In",       guestOnly: true } },
  { path: "/register",          component: RegisterView,   meta: { title: "Create Account", guestOnly: true } },
  { path: "/my-posts",          component: MyPostsView,    meta: { title: "My Recipes",    requiresAuth: true } },
  // FIX: /posts/create MUST be declared before /posts/:id
  // Vue Router matches in definition order — without this, visiting /posts/create
  // matches /:id with id="create", triggering a getPostById("create") 404.
  { path: "/posts/create",      component: CreatePostView, meta: { title: "New Recipe",    requiresAuth: true } },
  { path: "/posts/:id",         component: PostDetailView, meta: { title: "Recipe" } },
  { path: "/posts/:id/edit",    component: EditPostView,   meta: { title: "Edit Recipe",   requiresAuth: true } },
  { path: "/:pathMatch(.*)*",   component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: "smooth" };
  },
});

// ── Navigation guards ──────────────────────────────────────────────────────────
router.beforeEach((to) => {
  const auth = useAuthStore();

  document.title = to.meta.title
    ? `${to.meta.title} — The Fork & Pen`
    : "The Fork & Pen";

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: "/" };
  }
});

export default router;
