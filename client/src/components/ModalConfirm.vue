<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 backdrop-blur-sm" style="background:rgba(0,0,0,0.6)" />

        <!-- Dialog -->
        <div class="relative rounded-2xl shadow-2xl max-w-sm w-full p-6" style="background:var(--yt-surface);border:1px solid var(--yt-border)">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background:rgba(211,47,47,0.12)">
              <svg class="w-5 h-5" style="color:var(--yt-danger)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-lg" style="color:var(--yt-text)">{{ title }}</h3>
              <p class="text-sm mt-0.5" style="color:var(--yt-text-muted)">{{ message }}</p>
            </div>
          </div>

          <div class="flex gap-3 justify-end mt-6">
            <button @click="$emit('cancel')" class="btn-secondary">Cancel</button>
            <button @click="$emit('confirm')" class="btn-danger" :disabled="loading">
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              {{ loading ? "Deleting..." : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show:         { type: Boolean, default: false },
  title:        { type: String, default: "Are you sure?" },
  message:      { type: String, default: "This action cannot be undone." },
  confirmLabel: { type: String, default: "Delete" },
  loading:      { type: Boolean, default: false },
});
defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
