import { QRCodeSVG } from "qrcode.react";
import styled from "styled-components";

import { Text } from "preact-i18n";
import { useState } from "preact/hooks";

import { Category, Centred, Column, InputBox, Modal } from "@revoltchat/ui";

import { ModalProps } from "../types";

const Code = styled.code`
    user-select: all;
`;

/**
 * TOTP enable modal
 */
export default function MFAEnableTOTP({
    identifier,
    secret,
    callback,
    onClose,
}: ModalProps<"mfa_enable_totp">) {
    const uri = `otpauth://totp/Revolt:${identifier}?secret=${secret}&issuer=Revolt`;
    const [value, setValue] = useState("");

    return (
        <Modal
            title={<Text id="app.special.modals.mfa.enable_totp" />}
            description={<Text id="app.special.modals.mfa.prompt_totp" />}
            actions={[
                {
                    palette: "primary",
                    children: <Text id="app.special.modals.actions.continue" />,
                    onClick: () => {
                        callback(value.trim().replace(/\s/g, ""));
                        return true;
                    },
                    confirmation: true,
                },
                {
                    palette: "plain",
                    children: <Text id="app.special.modals.actions.cancel" />,
                    onClick: () => {
                        callback();
                        return true;
                    },
                },
            ]}
            onClose={() => {
                callback();
                onClose();
            }}>
            <Column>
                <Centred>
                    <QRCodeSVG
                        value={uri}
                        bgColor="transparent"
                        fgColor="var(--foreground)"
                    />
                </Centred>
                <Centred>
                    <Code>{secret}</Code>
                </Centred>
            </Column>

            <Category compact>
                <Text id="app.special.modals.mfa.enter_code" />
            </Category>

            <InputBox
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
            />
        </Modal>
    );
}
