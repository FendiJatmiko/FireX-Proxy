<template>
    <v-app>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>FireX Proxy</v-toolbar-title>
            <v-spacer></v-spacer>
            <add-proxy-component></add-proxy-component>
            <filter-list v-if="active === 'home'"></filter-list>
            <refresher v-if="active === 'home'"></refresher>
            <v-tabs v-model="active"
                    slot="extension"
                    grow
                    color="transparent"
                    slider-color="primary lighten-2">
                <v-tab key="1" href="#home">
                    {{ "home" | translate }}
                </v-tab>
                <v-tab key="2" href="#websites">
                    {{ "websites" | translate }}
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-content>
            <v-tabs-items v-model="active">
                <v-tab-item key="1" id="home">
                    <proxy-list></proxy-list>
                </v-tab-item>
                <v-tab-item key="2" id="websites">
                    <blacklist></blacklist>
                </v-tab-item>
            </v-tabs-items>
        </v-content>
        <v-dialog v-model="dialog" persistent>
            <v-card>
                <v-card-title class="headline">{{ 'conflict' | translate }}</v-card-title>
                <v-list class="conflicts">
                    <v-list-tile v-for="(extension, index) in this.conflicts" :key="index">
                        <v-list-tile-avatar>
                            <img :src="extension.icon">
                        </v-list-tile-avatar>
                        <v-list-tile-title>
                            {{ extension.shortName }}
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="resolveConflicts()">{{ 'conflict_resolve' | translate }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
    import ProxyList from "@/components/ProxyList.vue";
    import Refresher from "@/components/Refresher.vue";
    import FilterList from "@/components/FilterList.vue";
    import * as browser from 'webextension-polyfill';
    import Blacklist from "./components/Blacklist.vue";
    import AddProxyComponent from "./components/AddProxyComponent.vue";

    export default {
        name: 'popup',
        components: {
            AddProxyComponent,
            Blacklist,
            FilterList,
            ProxyList,
            Refresher
        },
        data() {
            return {
                conflicts: [],
                active: 'home',
                dialog: false
            };
        },
        watch: {
            conflicts(newVal) {
                if (newVal.length === 0) {
                    return;
                }

                this.dialog = true;
            }
        },
        methods: {
            receiveConflicts() {
                browser.runtime.sendMessage({
                    name: 'get-conflicts'
                }).then(conflicts => {
                    this.conflicts = conflicts;
                });
            },
            resolveConflicts() {
                this.dialog = false;
                this.conflicts = [];

                browser.runtime.sendMessage({
                    name: 'resolve-conflicts'
                });
            }
        },
        mounted() {
            this.receiveConflicts();
        }
    }
</script>

<style lang="scss">
    @import "scss/main.scss";

    #app {
        height: 100%;
        .v-content {
            max-height: calc(100% - 56px - 57px);
        }
        .conflicts {
            img {
                height: 16px;
                width: 16px;
            }
        }

        .v-tabs__items, .v-tabs__content {
            height: 100%;
            overflow: auto;
            overflow-x: hidden;
        }
    }
</style>
