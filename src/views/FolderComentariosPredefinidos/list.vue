<template>
  <ListComentariosPredefinidos />
</template>

<script>
export default {
  components: {
    ListComentariosPredefinidos: () => import("@/components/FolderComentariosPredefinidos/list.vue"),
  }
}
</script>