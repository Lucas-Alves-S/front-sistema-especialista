<!-- <template>
  <ComponentSelect ref="target" v-model="cursor" :multiple="multiple" :placeholder="placeholder" :clearable="clearable"
    :options="data" optionLabel="nome" optionValue="id" @clear="setModel" :disabled="disabled" :label="label">
  </ComponentSelect>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useAxios } from '@/services/axios'
import ComponentSelect from '@/components/ComponentSelect.vue'
import { onClickOutside } from '@vueuse/core'

const model = defineModel<any[] | any | null>({
  required: true
})

interface Props {
  url: string
  label?: string
  placeholder?: string
  clearable?: boolean
  multiple?: boolean
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  clearable: true,
  multiple: true,
  disabled: false
})

const cursor = ref(null)
const { data } = useAxios(props.url)
const target = useTemplateRef<HTMLElement>("target")

function setModel() {
  if (model.value !== cursor.value) {
    model.value = cursor.value
  }
}

onClickOutside(target, setModel)
</script> -->
