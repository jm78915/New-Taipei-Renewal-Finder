import { decodeJwt } from 'jose';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

declare let google: any;
declare let FB: any;

export interface Profile {
    picture: string;
}

export const useOAuthStore = defineStore('oAuth', () => {
    const googleProfile = reactive<Profile>({
        picture: '',
    });
    const facebookProfile = reactive<Profile>({
        picture: '',
    });

    async function loginGoogle() {
        return new Promise<void>((resolve) => {
            const script = document.body.appendChild(
                document.createElement('script'),
            );
            script.src = 'https://accounts.google.com/gsi/client';

            script.onload = () => {
                google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: (response: any) => {
                        const claims = decodeJwt<{
                            picture: string;
                        }>(response.credential);

                        googleProfile.picture = claims.picture;

                        resolve();
                    },
                });

                google.accounts.id.prompt();
            };
        });
    }

    async function loginFacebook() {
        return new Promise<void>((resolve) => {
            const script = document.body.appendChild(
                document.createElement('script'),
            );
            script.src = 'https://connect.facebook.net/en_US/sdk.js';

            script.onload = () => {
                // @ts-ignore
                window.fbAsyncInit = () => {
                    FB.init({
                        appId: import.meta.env.VITE_FB_APP_ID,
                        xfbml: import.meta.env.VITE_FB_XFBML,
                        version: import.meta.env.VITE_FB_VERSION,
                    });

                    FB.login((response: any) => {
                        if (response.authResponse) {
                            FB.api(
                                '/me',
                                { fields: 'picture' },
                                (response: any) => {
                                    facebookProfile.picture =
                                        response.picture.data.url;

                                    resolve();
                                },
                            );
                        } else {
                            console.log(
                                'User cancelled login or did not fully authorize.',
                            );
                        }
                    });
                };
            };
        });
    }

    return {
        googleProfile,
        facebookProfile,
        loginGoogle,
        loginFacebook,
    };
});
