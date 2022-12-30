<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'
import { useUserSession } from '/@src/stores/userSession'

type NavbarDropdownTheme = 'default' | 'colored' | 'fade'

const MY_BOOKS_ROUTE_NAME = `/books`
const COMPANY_MAKERS_ROUTE_NAME = `/company/[companyUuid]/makers`
const COMPANY_CLIENTS_ROUTE_NAME = `/company/[companyUuid]/clients`

const props = withDefaults(
  defineProps<{
    theme?: NavbarDropdownTheme
    nowrap?: boolean
  }>(),
  {
    theme: 'default',
  }
)

const viewWrapper = useViewWrapper()
const panels = usePanels()
const route = useRoute()
const router = useRouter()
const userSession = useUserSession()
const isMobileSidebarOpen = ref(false)
const activeMobileSubsidebar = ref('dashboard')

const isAdminUser = computed({
  get: (): any => Boolean(userSession.user?.role === `administrator`),
  set() {},
})

function goToMyBooks() {
  router.push({
    name: `${MY_BOOKS_ROUTE_NAME}/`,
  })
}

function goToCompanyMakers() {
  router.push({
    name: `${COMPANY_MAKERS_ROUTE_NAME}/`,
    params: {
      companyUuid: userSession.user.companyId,
    },
  })
}

function goToCompanyClients() {
  router.push({
    name: `${COMPANY_CLIENTS_ROUTE_NAME}/`,
    params: {
      companyUuid: userSession.user.companyId,
    },
  })
}

watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false
  }
)
</script>

<template>
  <div class="navbar-layout">
    <div class="app-overlay"></div>

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <RouterLink to="/" class="navbar-item is-brand">
          <AnimatedLogo width="38px" height="38px" />
        </RouterLink>

        <div class="brand-end">
          <!-- <NotificationsMobileDropdown /> -->
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <template v-if="isAdminUser">
          <li>
            <a
              tabindex="0"
              :class="{
                'is-current-route': $route.name.startsWith(COMPANY_MAKERS_ROUTE_NAME),
              }"
              @keydown.space.prevent="goToCompanyMakers"
              @click="goToCompanyMakers"
            >
              Intervenants
            </a>
          </li>
          <li>
            <a
              tabindex="0"
              :class="{
                'is-current-route': $route.name.startsWith(COMPANY_CLIENTS_ROUTE_NAME),
              }"
              @keydown.space.prevent="goToCompanyClients"
              @click="goToCompanyClients"
            >
              Clients
            </a>
          </li>
        </template>
        <template v-else>
          <li>
            <a
              tabindex="0"
              :class="{
                'is-current-route': $route.name.startsWith(MY_BOOKS_ROUTE_NAME),
              }"
              @keydown.space.prevent="goToCompanyMakers"
              @click="goToMyBooks"
            >
              Mes carnets de liaison
            </a>
          </li>
        </template>
        <!-- <li>
          <a
            :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']"
            tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'dashboard'"
            @click="activeMobileSubsidebar = 'dashboard'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:activity"></i>
          </a>
        </li> -->
        <!-- <li>
          <a
            :class="[activeMobileSubsidebar === 'layout' && 'is-active']"
            tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'layout'"
            @click="activeMobileSubsidebar = 'layout'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'elements' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'elements'"
          @click="activeMobileSubsidebar = 'elements'"
        >
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:box"></i>
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'components' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'components'"
          @click="activeMobileSubsidebar = 'components'"
        >
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu"></i>
          </a>
        </li>
        <li>
          <RouterLink to="/messaging-v1">
            <i aria-hidden="true" class="iconify" data-icon="feather:message-circle"></i>
          </RouterLink>
        </li> -->
      </template>

      <!-- <template #bottom-links>
        <li>
          <a
            tabindex="0"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
          </a>
        </li>
        <li>
          <a href="#">
            <i aria-hidden="true" class="iconify" data-icon="feather:settings"></i>
          </a>
        </li>
      </template> -->
    </MobileSidebar>

    <!-- Mobile subsidebar links -->
    <!-- <Transition name="slide-x">
      <LayoutsMobileSubsidebar
        v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'layout'"
      />
      <DashboardsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'dashboard'"
      />
      <ComponentsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'components'"
      />
      <ElementsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'elements'"
      />
    </Transition> -->

    <Navbar :theme="props.theme">
      <!-- Custom navbar title -->
      <template #title>
        <RouterLink to="/" class="brand">
          <AnimatedLogo width="38px" height="38px" />
        </RouterLink>

        <div class="separator"></div>

        <!-- <ProjectsQuickDropdown /> -->
        <h1 class="title is-5">{{ viewWrapper.pageTitle }}</h1>
      </template>

      <!-- Custom navbar toolbar -->
      <template #toolbar>
        <UserProfileDropdown />
      </template>

      <!-- Custom navbar links -->
      <template #links>
        <div v-if="isAdminUser" class="centered-drops">
          <div class="centered-simple-button">
            <VButton
              :class="{
                'is-current-route': $route.name.startsWith(COMPANY_MAKERS_ROUTE_NAME),
              }"
              @click="goToCompanyMakers"
            >
              Intervenants
            </VButton>
          </div>
          <div class="centered-simple-button">
            <VButton
              :class="{
                'is-current-route': $route.name.startsWith(COMPANY_CLIENTS_ROUTE_NAME),
              }"
              @click="goToCompanyClients"
            >
              Clients
            </VButton>
          </div>
        </div>
        <div v-else class="centered-drops">
          <div class="centered-simple-button">
            <VButton
              :class="{
                'is-current-route': $route.name.startsWith(MY_BOOKS_ROUTE_NAME),
              }"
              @click="goToMyBooks"
            >
              Mes carnets de liaison
            </VButton>
          </div>
        </div>
      </template>
    </Navbar>

    <VViewWrapper top-nav>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <VPageContent v-else class="is-relative">
          <div class="is-navbar-lg p-t-10">
            <slot></slot>
          </div>
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>
