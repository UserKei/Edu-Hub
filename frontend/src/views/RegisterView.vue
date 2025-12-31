<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthCard from '../components/auth/AuthCard.vue'
import AppInput from '../components/ui/AppInput.vue'
import AppButton from '../components/ui/AppButton.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  try {
    await authStore.register({
      username: username.value,
      password: password.value
    })
    // Redirect to login after successful registration
    router.push('/login')
  } catch (error) {
    console.error('Register failed:', error)
    errorMessage.value = error.response?.data?.message || 'Registration failed'
  }
}
</script>

<template>
  <AuthCard :title="t('auth.register.title')">
    <form @submit.prevent="handleRegister" class="flex flex-col gap-6">
      <div v-if="errorMessage" class="text-ctp-red text-center">
        {{ errorMessage }}
      </div>
      <AppInput
        v-model="username"
        :label="t('auth.field.username')"
        icon="ph:user"
        :placeholder="t('auth.field.username')"
      />

      <AppInput
        v-model="password"
        type="password"
        :label="t('auth.field.password')"
        icon="ph:lock"
        :placeholder="t('auth.field.password')"
      />

      <AppInput
        v-model="confirmPassword"
        type="password"
        :label="t('auth.field.confirm_password')"
        icon="ph:lock"
        :placeholder="t('auth.field.confirm_password')"
      />

      <div class="mt-4">
        <AppButton type="submit" variant="primary">
          {{ t('auth.register.submit') }}
        </AppButton>
      </div>
    </form>

    <template #footer>
      <RouterLink to="/login" class="text-ctp-blue hover:underline text-lg">
        {{ t('auth.register.has_account') }}
      </RouterLink>
    </template>
  </AuthCard>
</template>
