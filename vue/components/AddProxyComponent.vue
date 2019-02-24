<template>
    <v-menu
            :close-on-content-click="false"
            :light="true"
            top
            left
            max-width="80%"
            min-width="80%">
        <v-btn slot="activator" icon :dark="true">
            <v-icon>add</v-icon>
        </v-btn>
        <v-card>
            <v-form>
                <v-container>
                    <h1>{{ 'add_new_server' | translate }}</h1>
                    <v-radio-group v-model="protocol">
                        <v-radio :label="'SOCKS5'" :value="'SOCKS5'"></v-radio>
                        <v-radio :label="'HTTP'" :value="'HTTP'"></v-radio>
                        <v-radio :label="'HTTPS'" :value="'HTTPS'"></v-radio>
                    </v-radio-group>
                    <h2>{{ 'details' | translate }}</h2>
                    <v-layout>
                        <v-flex xs8>
                            <v-text-field v-model="hostname" :label="this.$options.filters.translate('hostname')" required></v-text-field>
                        </v-flex>

                        <v-flex xs4>
                            <v-text-field v-model="port" :label="this.$options.filters.translate('port')" required></v-text-field>
                        </v-flex>
                    </v-layout>
                    <h2>{{ 'credentials' | translate }}</h2>
                    <v-layout>
                        <v-flex xs6>
                            <v-text-field v-model="username" :label="this.$options.filters.translate('username')"></v-text-field>
                        </v-flex>

                        <v-flex xs6>
                            <v-text-field v-model="password" type="password" :label="this.$options.filters.translate('password')"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-btn color="success" @click="add">{{'create'|translate}}</v-btn>
                    <v-btn color="error" @click="reset">{{'reset'|translate}}</v-btn>
                </v-container>
            </v-form>
        </v-card>
    </v-menu>
</template>


<script>
    import * as browser from 'webextension-polyfill'
    import * as constants from '@/common/constants.js'
    import bus from '@/common/bus.js'

    export default {
        name: 'AddProxyComponent',
        data() {
            return {
                protocol: "SOCKS5",
                hostname: "",
                port: "",
                username: "",
                password: ""
            }
        },
        methods: {
            reset() {
                Object.assign(this, {
                    protocol: "SOCKS5",
                    hostname: "",
                    port: "",
                    username: "",
                    password: ""
                });
            },
            add() {
                browser.runtime.sendMessage({
                    name: 'add-proxy',
                    message: {
                        protocol: this.protocol,
                        hostname: this.hostname,
                        port: this.port,
                        username: this.username,
                        password: this.password
                    }
                });

                this.$store.dispatch('poll', true).then(() => bus.$emit(constants.PROXY_UPDATE_FINISHED));
            }
        }
    }
</script>

<style>

</style>