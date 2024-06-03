<template>
    <div
      id="card-list-header"
      class="md:flex items-center flex-grow justify-between mb-8 text-center"
    >
      <div class="md:flex items-center md:mb-0 mb-4">
        <div
          v-if="allowCreate"
          class="py-2 px-6 mr-4 rounded-lg cursor-pointer md:flex inline-block items-center justify-between text-lg  text-white bg-primary"
          @click="$emit('create')"
          id="createButton"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base">{{ $t("CardList.Header.Create") }}</span>
        </div>
        <div
          v-if="allowImport"
          class="py-2 px-6 mr-4 rounded-lg cursor-pointer md:flex inline-block items-center justify-between text-lg text-primary border border-solid border-primary"
          @click="chooseArchive"
          id="importButton"
        >
          <feather-icon icon="ArrowUpCircleIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-primary">{{
            $t("CardList.Header.Import")
          }}</span>
        </div>
      </div>
  
      <div class="md:flex items-center">
        <div class="ml-4">
          <vs-dropdown
            v-if="sortingOptions.length > 0"
            vs-trigger-click
            class="cursor-pointer ml-4"
            id="sortingFieldSelector"
          >
            <div
              class="px-6 py-2 border border-solid border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between"
            >
              <span class="mr-2">{{ $t("fields." + sortingOrder.field) }}</span>
              <feather-icon
                v-if="sortingOrder.order === 'ASC'"
                icon="ArrowUpIcon"
                svgClasses="h-4 w-4"
              />
              <feather-icon
                v-if="sortingOrder.order === 'DESC'"
                icon="ArrowDownIcon"
                svgClasses="h-4 w-4"
              />
            </div>
  
            <vs-dropdown-menu class="w-48 sorting-order">
              <template v-for="option in sortingOptions" :key="option + '.ASC'">
                <vs-dropdown-item
                  @click="onSortingOrderChanged(option, 'ASC')"
                >
                  <span>{{ $t("fields." + option) }}</span>
                  <feather-icon icon="ArrowUpIcon" svgClasses="h-4 w-4" />
                </vs-dropdown-item>
                <vs-dropdown-item
                   :key="option + '.DESC'"
                  @click="onSortingOrderChanged(option, 'DESC')"
                >
                  <span>{{ $t("fields." + option) }}</span>
                  <feather-icon icon="ArrowDownIcon" svgClasses="h-4 w-4" />
                </vs-dropdown-item>
              </template>
            </vs-dropdown-menu>
          </vs-dropdown>
          <vs-dropdown vs-trigger-click class="cursor-pointer ml-4" id="pageSizeSelector">
            <div
              class="px-6 py-2 border border-solid border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between"
            >
              <span class="mr-2">
                {{
                  $t("CardList.Header.ItemsPerPage", {
                    start,
                    end,
                    size
                  })
                }}
              </span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
  
            <vs-dropdown-menu class="w-24">
              <vs-dropdown-item
                v-for="size in pageSizes"
                :key="size"
                @click="$emit('itemsperpagechange', size)"
              >
                <span>{{ size }}</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
        <div class="ml-4 p-4 md:flex items-center">
          <vs-icon
            class="cursor-pointer"
            icon-pack="mi"
            :icon="tableView ? 'view_list' : 'view_comfy'"
            @click="onViewChanged"
            id="listViewToggle"
          ></vs-icon>
        </div>
      </div>
      <input
        v-if="allowImport"
        id="archiveImport"
        type="file"
        hidden
        style="display:none"
        accept="application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip,text/javascript,application/json"
        @change="importArchive($event.target.files[0])"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: "card-list-header",
    props: {
      size: Number,
      currentPage: Number,
      itemsPerPage: Number,
      sortingOrder: Object,
      tableView: {
        type: Boolean,
        default: true
      },
      pageSizes: {
        type: Array,
        default: () => [6, 12, 18, 24]
      },
      sortingOptions: {
        type: Array,
        default: () => []
      },
      allowCreate: {
        type: Boolean,
        default: true
      },
      allowImport: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {};
    },
    computed: {
      start() {
        return this.currentPage * this.itemsPerPage - (this.itemsPerPage - 1);
      },
      end() {
        return this.size - this.currentPage * this.itemsPerPage > 0
          ? this.currentPage * this.itemsPerPage
          : this.size;
      }
    },
    methods: {
      onViewChanged() {
        this.$emit("viewchange", !this.tableView);
      },
      onSortingOrderChanged(field, order) {
        this.$emit("sortchange", { field, order });
      },
      chooseArchive() {
        document.getElementById("archiveImport").click();
      },
      importArchive(file) {
        if (file) {
          this.$emit("import", file);
        }
        document.getElementById("archiveImport").value = "";
      }
    }
  };
  </script>