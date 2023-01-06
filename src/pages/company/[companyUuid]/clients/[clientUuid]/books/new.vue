<script lang="ts" setup>
import { useClient } from '/@src/stores/client'

const client = useClient()

const isSavingClient = ref(true)

const clientLabel = computed({
  get: (): any => client?.client?.label || ``,
  set() {},
})

async function saveClient() {
  isSavingClient.value = true
  isSavingClient.value = false
}
</script>

<template>
  <div class="account-box is-form">
    <div class="form-head">
      <div class="form-head-inner">
        <div class="left">
          <h3>Nouveau carnet de liaison</h3>
        </div>
      </div>
    </div>
    <div class="form-body">
      <VField>
        <VLabel>Pour le client</VLabel>
        <VControl>
          <VInput
            v-model="clientLabel"
            type="text"
            name="client-label"
            placeholder="..."
            data-form-type="other"
            disabled
          />
        </VControl>
      </VField>
      <VFlex justify-content="end" align-items="center" class="m-t-20">
        <VButton color="primary" raised disabled tabindex="0">Créer ce carnet</VButton>
      </VFlex>
    </div>
  </div>
</template>