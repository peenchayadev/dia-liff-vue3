<template>
  <div class="p-6 space-y-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900">Base Components Demo</h1>
    
    <!-- TextField Demo -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">TextField Components</h2>
      
      <BaseTextField
        v-model="textValue"
        label="ข้อความทั่วไป"
        placeholder="กรอกข้อความ"
        helper-text="ข้อความช่วยเหลือ" />
      
      <BaseTextField
        v-model="numberValue"
        type="number"
        label="ตัวเลข"
        placeholder="กรอกตัวเลข"
        icon="mdi:calculator"
        clearable />
      
      <BaseTextField
        v-model="errorValue"
        label="ฟิลด์ที่มี Error"
        placeholder="กรอกข้อมูล"
        error-message="กรุณากรอกข้อมูลให้ถูกต้อง"
        variant="outlined" />
    </section>
    
    <!-- Select Demo -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Select Components</h2>
      
      <BaseSelect
        v-model="selectValue"
        label="Native Select"
        placeholder="กรุณาเลือก"
        :options="selectOptions"
        helper-text="Native select element" />
      
      <BaseDropdown
        v-model="dropdownValue"
        label="Custom Dropdown"
        placeholder="กรุณาเลือก"
        :options="selectOptions"
        helper-text="Custom dropdown component" />
    </section>
    
    <!-- Textarea Demo -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Textarea Components</h2>
      
      <BaseTextarea
        v-model="textareaValue"
        label="ข้อความยาว"
        placeholder="กรอกข้อความยาว..."
        :rows="4"
        :max-length="200"
        show-char-count
        helper-text="สามารถกรอกได้สูงสุด 200 ตัวอักษร" />
    </section>
    
    <!-- Button Demo -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Button Components</h2>
      
      <div class="flex flex-wrap gap-3">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="outline">Outline</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
        <BaseButton variant="danger">Danger</BaseButton>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <BaseButton size="sm" variant="primary">Small</BaseButton>
        <BaseButton size="md" variant="primary">Medium</BaseButton>
        <BaseButton size="lg" variant="primary">Large</BaseButton>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <BaseButton variant="primary" icon-left="mdi:plus">With Icon</BaseButton>
        <BaseButton variant="outline" :loading="isLoading" @click="toggleLoading">
          {{ isLoading ? 'Loading...' : 'Click Me' }}
        </BaseButton>
      </div>
    </section>
    
    <!-- Modal Demo -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Modal Component</h2>
      
      <BaseButton variant="primary" @click="showModal = true">
        เปิด Modal
      </BaseButton>
      
      <BaseModal v-model:is-open="showModal">
        <template #content>
          <div class="text-center space-y-4">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Icon icon="mdi:check" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">ตัวอย่าง Modal</h3>
            <p class="text-gray-600">นี่คือตัวอย่างการใช้งาน BaseModal component</p>
          </div>
        </template>
        
        <template #actions>
          <BaseButton variant="outline" full-width @click="showModal = false">
            ปิด
          </BaseButton>
          <BaseButton variant="primary" full-width @click="showModal = false">
            ตกลง
          </BaseButton>
        </template>
      </BaseModal>
    </section>
    
    <!-- Values Display -->
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-800">Current Values</h2>
      <div class="bg-gray-100 p-4 rounded-xl">
        <pre class="text-sm">{{ JSON.stringify({
          textValue,
          numberValue,
          errorValue,
          selectValue,
          dropdownValue,
          textareaValue
        }, null, 2) }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { BaseModal, BaseTextField, BaseSelect, BaseDropdown, BaseTextarea, BaseButton } from '@/components/Base'

const textValue = ref('')
const numberValue = ref('')
const errorValue = ref('')
const selectValue = ref('')
const dropdownValue = ref('')
const textareaValue = ref('')
const showModal = ref(false)
const isLoading = ref(false)

const selectOptions = [
  { label: 'ตัวเลือกที่ 1', value: 'option1' },
  { label: 'ตัวเลือกที่ 2', value: 'option2' },
  { label: 'ตัวเลือกที่ 3', value: 'option3' }
]

function toggleLoading(): void {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<style scoped></style>