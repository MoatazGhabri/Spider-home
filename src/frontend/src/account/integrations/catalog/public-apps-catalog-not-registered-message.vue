<template>
    <whole-screen-message icon="pe-7s-mouse"
        header-i18n="Your private SPIDER HOME  is not registered.">
        <i18n-t keypath="If you want to integrate your Cloud with public OAuth applications, you must {registerYourSpiderhomeCloudLink}."
            tag="p">
            <template #registerYourSuplaCloudLink>
                <a href="https://cloud.spiderhome.org/register-cloud">{{ $t('Register your SPIDER HOME ') }}</a>
            </template>
        </i18n-t>
        <i18n-t keypath="If you wish to see the available integrations, go to {0}."
            tag="p">
            <a href="https://cloud.spiderhome.org/apps">cloud.spiderhome.org/apps</a>
        </i18n-t>
        <p>
            {{ $t('Otherwise go to the homepage.') }}
            <router-link to="/">{{ $t('Start from the homepage.') }}</router-link>
        </p>
    </whole-screen-message>
</template>

<script setup>
    import WholeScreenMessage from "../../../register/whole-screen-message.vue";</script>
