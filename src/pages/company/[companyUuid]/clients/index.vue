<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useCompany } from '/@src/stores/company'
import { useClient } from '/@src/stores/client'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const router = useRouter()
const route = useRoute()
const company = useCompany()
const client = useClient()
const viewWrapper = useViewWrapper()

const loading = ref(false)
const datas = ref(<any>[])
const searchString = ref(``)

const flavoredDatas = computed({
  get: (): any =>
    datas.value.map((data: any) => ({
      ...data,
    })),
  set() {},
})

const filteredDatas = computed({
  get: (): any => flavoredDatas.value,
  set() {},
})

async function fetchDatas() {
  if (!company?.company?.id) return

  loading.value = true

  datas.value = await client.loadClientsForCompany(company.company.id)

  loading.value = false
}

function goToClient(client) {
  router.push({
    name: `/company/[companyUuid]/clients/[clientUuid]/informations`,
    params: {
      companyUuid: route.params.companyUuid,
      clientUuid: client.id,
    },
  })
}

onBeforeMount(() => {
  fetchDatas()
})

viewWrapper.setPageTitle(`Vos clients`)
</script>

<template>
  <div>
    <div class="list-view-toolbar">
      <VField>
        <VControl icon="feather:search">
          <input
            v-model="searchString"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <div class="list-info">
        <span>
          {{ filteredDatas.length }} résultat{{ filteredDatas.length > 1 ? `s` : `` }}
        </span>
      </div>

      <div class="buttons">
        <VButton color="primary" icon="fas fa-plus" elevated>Nouveau client</VButton>
      </div>
    </div>
    <div class="page-content-inner">
      <!--List-->
      <div class="list-view list-view-v1">
        <div class="list-view-inner">
          <!--Item-->
          <TransitionGroup name="list-complete" tag="div">
            <div v-for="(item, key) in filteredDatas" :key="key" class="list-view-item">
              <div class="list-view-item-inner">
                <div class="meta-left">
                  <h3>{{ item.label }}</h3>
                  <span>
                    <i
                      aria-hidden="true"
                      class="iconify m-r-5"
                      data-icon="feather:map-pin"
                    ></i>
                    <span>La Roche-sur-Yon</span>
                  </span>
                </div>
                <div class="meta-right">
                  <button
                    class="button is-light is-circle hint--bubble hint--primary hint--top"
                    data-hint="Voir details"
                    @click="goToClient(item)"
                  >
                    <span class="icon is-small">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:arrow-right"
                      ></i>
                      <!-- <i aria-hidden="true" class="iconify" data-icon="feather:heart"></i> -->
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
