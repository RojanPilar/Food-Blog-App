<template>
  <div class="yt-page-pad" style="max-width:800px">
    <div style="margin-bottom:28px">
      <RouterLink to="/" class="btn-ghost" style="padding-left:0;font-size:13px;margin-bottom:12px;display:inline-flex">← Back</RouterLink>
      <h1 style="font-weight:800;font-size:28px;color:var(--yt-text)">
        {{ isEditing ? "Edit recipe" : "Share a recipe" }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" style="display:flex;flex-direction:column;gap:24px">
      <!-- Error -->
      <div v-if="error" style="padding:14px;background:#fce4ec;border:1px solid #ef9a9a;border-radius:8px;font-size:13px;color:#c62828">
        {{ error }}
      </div>

      <!-- Title -->
      <div>
        <label class="input-label">Recipe title *</label>
        <input v-model="form.title" type="text" placeholder="e.g. Classic Neapolitan Margherita"
          maxlength="120" required class="input-field" style="font-size:18px;" />
      </div>

      <!-- Cover image URL -->
      <div>
        <label class="input-label">Cover image URL</label>
        <input v-model="form.coverImage" type="url" placeholder="https://..." class="input-field" />
        <div v-if="form.coverImage" style="margin-top:8px;border-radius:8px;overflow:hidden;aspect-ratio:16/9;background:var(--yt-surface-alt)">
          <img :src="form.coverImage" alt="Cover preview" style="width:100%;height:100%;object-fit:cover" @error="form.coverImage = ''" />
        </div>
      </div>

      <!-- Content -->
      <div>
        <label class="input-label">Recipe / story *</label>
        <textarea v-model="form.content" placeholder="Walk through the steps, share the story, give your tips..."
          rows="10" required class="input-field" style="resize:vertical;min-height:200px" />
      </div>

      <!-- Ingredients -->
      <div>
        <label class="input-label">Ingredients</label>
        <p style="font-size:12px;color:var(--yt-text-hint);margin-bottom:6px">One per line</p>
        <textarea v-model="ingredientsText" placeholder="2 cups 00 flour&#10;1 tsp salt&#10;7g dried yeast"
          rows="5" class="input-field" style="resize:vertical;font-family:monospace;font-size:13px" />
      </div>

      <!-- Meta grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px">
        <div>
          <label class="input-label">Cook time (min)</label>
          <input v-model.number="form.cookingTime" type="number" min="1" placeholder="45" class="input-field" />
        </div>
        <div>
          <label class="input-label">Prep time (min)</label>
          <input v-model.number="form.prepTime" type="number" min="0" placeholder="15" class="input-field" />
        </div>
        <div>
          <label class="input-label">Servings</label>
          <input v-model.number="form.servings" type="number" min="1" placeholder="4" class="input-field" />
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <label class="input-label">Difficulty</label>
          <select v-model="form.difficulty" class="input-field">
            <option value="">— Select —</option>
            <option v-for="d in difficulties" :key="d">{{ d }}</option>
          </select>
        </div>
        <div>
          <label class="input-label">Cuisine</label>
          <input v-model="form.cuisine" type="text" placeholder="e.g. Italian, Thai, Mexican" class="input-field" />
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label class="input-label">Tags</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            @click="toggleTag(tag)"
            :class="['yt-chip', form.tags.includes(tag) ? 'active' : '']"
          >{{ tag }}</button>
        </div>
      </div>

      <!-- Submit -->
      <div style="display:flex;gap:12px;padding-top:8px">
        <button type="submit" class="btn-primary" :disabled="loading" style="min-width:140px;justify-content:center">
          <svg v-if="loading" style="width:16px;height:16px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
            <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" opacity="0.75"/>
          </svg>
          {{ loading ? "Saving..." : (isEditing ? "Save changes" : "Publish recipe") }}
        </button>
        <RouterLink :to="isEditing && initialData ? `/posts/${$route.params.id}` : '/'" class="btn-secondary">
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";

const props = defineProps({
  initialData: { type: Object, default: null },
  loading:     { type: Boolean, default: false },
  error:       { type: String,  default: "" },
  isEditing:   { type: Boolean, default: false },
});
const emit = defineEmits(["submit"]);

const difficulties = ["Beginner", "Intermediate", "Advanced", "Pro Chef"];
const allTags = [
  "Vegan","Vegetarian","Gluten-Free","Dairy-Free","Quick Meal","Dessert",
  "Breakfast","Lunch","Dinner","Snack","Appetizer","Soup","Salad","Seafood",
  "Pasta","Grilling","Baking","Asian","Mediterranean","Mexican","Italian","American",
];

const form = reactive({
  title: "", content: "", excerpt: "", coverImage: "",
  cookingTime: "", prepTime: "", servings: "",
  difficulty: "", cuisine: "", tags: [], ingredients: [],
});

// FIX: Watch initialData so EditPostView can hydrate the form after the fetch resolves
watch(() => props.initialData, (data) => {
  if (!data) return;
  Object.assign(form, {
    title:       data.title       || "",
    content:     data.content     || "",
    excerpt:     data.excerpt     || "",
    coverImage:  data.coverImage  || "",
    cookingTime: data.cookingTime ?? "",
    prepTime:    data.prepTime    ?? "",
    servings:    data.servings    ?? "",
    difficulty:  data.difficulty  || "",
    cuisine:     data.cuisine     || "",
    tags:        data.tags        ? [...data.tags]        : [],
    ingredients: data.ingredients ? [...data.ingredients] : [],
  });
  ingredientsText.value = (data.ingredients || []).join("\n");
}, { immediate: true });

const ingredientsText = ref("");

function toggleTag(tag) {
  const idx = form.tags.indexOf(tag);
  if (idx === -1) form.tags.push(tag);
  else form.tags.splice(idx, 1);
}

function handleSubmit() {
  form.ingredients = ingredientsText.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  emit("submit", { ...form });
}
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
</style>
