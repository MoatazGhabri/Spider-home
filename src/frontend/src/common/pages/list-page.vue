<template>
    <div class="list-container">
        <div class="list-header">
            <div class="header-content">
                <div class="title-section">
                    <h1 v-if="!subject" class="main-title">{{ $t(headerI18n) }}</h1>
                    <h4 v-if="subtitleI18n" class="subtitle">{{ $t(subtitleI18n) }}</h4>
                </div>
                <div class="action-section" :class="{ 'no-margin': subject }">
                    <button type='button' @click="createNewItem()"
                            v-if="createNewLabelI18n"
                            class="add-button">
                        <i class="pe-7s-plus"></i>
                        <span class="button-text">{{ $t(createNewLabelI18n) }}</span>
                    </button>
                </div>
            </div>
            
            <component v-if="filters && items"
                      :is="filters"
                      :items="items"
                      class="filters-section"
                      @filter-function="filterFunction = $event; filter()"
                      @compare-function="compareFunction = $event; filter()"
                      @filter="filter()"></component>
        </div>
        
        <loading-cover :loading="!items">
            <div v-if="filteredItems" class="items-grid-container">
                <square-links-grid v-if="filteredItems.length"
                                   :count="filteredItems.length">
                    <div v-for="item in filteredItems"
                         :key="item.id"
                         class="grid-item">
                        <component :is="tile"
                                  :model="item"></component>
                    </div>
                </square-links-grid>
                <empty-list-placeholder v-else class="empty-state"></empty-list-placeholder>
            </div>
        </loading-cover>
    </div>
</template>

<script>
    import changeCase from "change-case";
    import AppState from "../../router/app-state";
    import {debounce} from "lodash";

    export default {
        props: ['subject', 'headerI18n', 'subtitleI18n', 'tile', 'filters', 'endpoint', 'createNewLabelI18n', 'detailsRoute', 'limit'],
        data() {
            return {
                items: undefined,
                filteredItems: undefined,
                filterFunction: () => true,
                compareFunction: () => -1,
            };
        },
        mounted() {
            let endpoint = this.endpoint;
            if (this.subject) {
                endpoint = `${changeCase.paramCase(this.subject.ownSubjectType)}s/${this.subject.id}/${endpoint}`;
            }
            this.$http.get(endpoint)
                .then(response => this.items = response.body)
                .then(() => this.filter());
        },
        computed: {
            subjectId() {
                return this.subject.id;
            }
        },
        methods: {
            createNewItem() {
                if (this.detailsRoute) {
                    if (this.subject) {
                        AppState.addTask(this.detailsRoute + 'Create', this.subject);
                    }
                    this.$router.push({name: this.detailsRoute, params: {id: 'new'}});
                } else {
                    this.$emit('add');
                }
            },
            filter: debounce(function () {
                this.filteredItems = this.items ? this.items.filter(this.filterFunction) : this.items;
                if (this.filteredItems) {
                    this.filteredItems = this.filteredItems.sort(this.compareFunction);
                }
            }, 50),
        },
    };
</script>

<style scoped>
.list-container {
    max-width: 1350px;
    margin: 0 auto;
    padding: 0 20px;
}

.list-header {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
}

.title-section {
    flex: 1;
    min-width: 200px;
}

.main-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 4px 0;
}

.subtitle {
    font-size: 1rem;
    font-weight: 400;
    color: #7f8c8d;
    margin: 0;
}

.action-section {
    margin-top: 8px;
}

.action-section.no-margin {
    margin-top: 0;
}

.add-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #011627;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button:hover {
    background: #022038;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-button:active {
    transform: translateY(0);
}

.add-button i {
    margin-right: 8px;
    font-size: 1.2rem;
}

.filters-section {
    margin-top: 24px;
}

.items-grid-container {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.grid-item {
    transition: transform 0.2s ease;
}

.grid-item:hover {
    transform: translateY(-4px);
}

.empty-state {
    padding: 40px 0;
    text-align: center;
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
    }
    
    .action-section {
        width: 100%;
    }
    
    .add-button {
        width: 100%;
    }
}
</style>