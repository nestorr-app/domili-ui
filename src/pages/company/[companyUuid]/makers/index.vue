<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useCompany } from '/@src/stores/company'
import { useMaker } from '/@src/stores/maker'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const company = useCompany()
const maker = useMaker()
const viewWrapper = useViewWrapper()

const loading = ref(false)
const datas = ref(<any>[])
const searchString = ref(``)

const flavoredDatas = computed({
  get: (): any =>
    datas.value.map((data: any) => ({
      ...data,
      initials: `${data.firstname.charAt(0)}${data.lastname.charAt(0)}`.toUpperCase(),
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

  datas.value = await maker.loadMakersForCompany(company.company.id)

  loading.value = false
}

onBeforeMount(() => {
  fetchDatas()
})

viewWrapper.setPageTitle(`Vos intervenants`)
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
        <VButton color="primary" icon="fas fa-plus" elevated>Nouvel intervenant</VButton>
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
                <VAvatar :initials="item.initials" size="large" color="h-blue" />
                <div class="meta-left">
                  <h3>{{ item.firstname }} {{ item.lastname }}</h3>
                  <span>
                    <i
                      aria-hidden="true"
                      class="iconify m-r-5"
                      data-icon="feather:map-pin"
                    ></i>
                    <span>La Roche-sur-Yon</span>
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
