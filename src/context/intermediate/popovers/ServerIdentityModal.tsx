import { observer } from "mobx-react-lite";
import { Server } from "revolt.js";

import styles from "./ServerIdentityModal.module.scss";
import { Text } from "preact-i18n";
import { useEffect, useState } from "preact/hooks";

import { Button, Category, InputBox, Modal } from "@revoltchat/ui";

import { noop } from "../../../lib/js";

import { FileUploader } from "../../revoltjs/FileUploads";
import { useClient } from "../../revoltjs/RevoltClient";

interface Props {
    server: Server;
    onClose: () => void;
}

export const ServerIdentityModal = observer(({ server, onClose }: Props) => {
    const client = useClient();
    const member = client.members.getKey({
        server: server._id,
        user: client.user!._id,
    });

    if (!member) return null;

    const [nickname, setNickname] = useState("");
    const [currentNickname, setCurrentNickname] = useState("");
    useEffect(() => {
        setNickname(member.nickname ?? "");
        setCurrentNickname(member.nickname ?? "");
    }, [member.nickname]);

    return (
        <Modal
            title={
                <Text
                    id={"app.special.popovers.server_identity.title"}
                    fields={{ server: server.name }}
                />
            }
            onClose={onClose}>
            <div className={styles.identityMain}>
                <div>
                    <Category>
                        <Text id="app.special.popovers.server_identity.avatar" />
                    </Category>
                    <FileUploader
                        width={80}
                        height={80}
                        style="icon"
                        fileType="avatars"
                        behaviour="upload"
                        maxFileSize={4_000_000}
                        onUpload={(avatar) =>
                            member.edit({ avatar }).then(noop)
                        }
                        remove={() =>
                            member.edit({ remove: ["Avatar"] }).then(noop)
                        }
                        defaultPreview={client.user?.generateAvatarURL(
                            {
                                max_side: 256,
                            },
                            false,
                        )}
                        previewURL={client.generateFileURL(
                            member.avatar ?? undefined,
                            { max_side: 256 },
                            true,
                        )}
                        desaturateDefault
                    />
                </div>
                <div>
                    <Category>
                        <Text id="app.special.popovers.server_identity.nickname" />
                    </Category>
                    <InputBox
                        value={nickname}
                        placeholder={client.user!.username}
                        onChange={(e) => setNickname(e.currentTarget.value)}
                    />
                    <div className={styles.buttons}>
                        <Button
                            disabled={nickname === currentNickname}
                            onClick={() => member.edit({ nickname })}>
                            <Text id="app.special.modals.actions.save" />
                        </Button>
                        {currentNickname !== "" && (
                            <Button
                                palette="plain"
                                onClick={() =>
                                    member.edit({ remove: ["Nickname"] })
                                }>
                                <Text id="app.special.modals.actions.remove" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
});
