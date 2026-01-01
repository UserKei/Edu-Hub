import { toast } from 'vue-sonner'

export function useToast() {
  return {
    success: (msg, options) => toast.success(msg, options),
    error: (msg, options) => toast.error(msg, options),
    info: (msg, options) => toast.info(msg, options),
    warning: (msg, options) => toast.warning(msg, options),
    promise: (promise, options) => toast.promise(promise, options),
    // Expose raw toast for custom needs
    raw: toast
  }
}
