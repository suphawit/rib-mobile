import LocalAuthentication

// Key parameters
private let keyType = kSecAttrKeyTypeRSA
private let keySize = 2048

// ASN.1 encoding parameters.
private let ASNHeaderLengthForRSA = 15
private let ASNHeaderSequenceMark: UInt8 = 48 // 0x30
private let ASNHeaderBitstringMark: UInt8 = 03 //0x03
private let ASNExtendedLengthMark: UInt8 = 128  // 0x80

// RSA OID header
private let RSAOIDHeader: [UInt8] = [0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00]
private let RSAOIDHeaderLength = 15

// PEM encoding constants
private let publicKeyInitialTag = "-----BEGIN PUBLIC KEY-----\n"
private let publicKeyFinalTag = "-----END PUBLIC KEY-----"
private let publicKeyCharInLine = 64

@available(iOS 10.0, *)
@objc(BiometricAuthen) class BiometricAuthen: CDVPlugin {
    
    var resultDicts:[String: Any]?
    
    @objc(isAvailable:)
    func isAvailable(command: CDVInvokedUrlCommand) {
        if(isAvailable()) {
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDicts),
                callbackId: command.callbackId
            )
        } else {
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDicts),
                callbackId: command.callbackId
            )
        }
    }
    
    @objc(isBioStateChanged:)
    func isBioStateChanged(command: CDVInvokedUrlCommand) {
        if(isBioStateChanged()) {
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_OK),
                callbackId: command.callbackId
            )
        } else {
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR),
                callbackId: command.callbackId
            )
        }
    }

    @objc(setBioState:)
    func setBioState(command: CDVInvokedUrlCommand) {
        if(setBiometricState()) {
            self.commandDelegate!.send(
               CDVPluginResult(status: CDVCommandStatus_OK),
               callbackId: command.callbackId
            )
        } else {
            self.commandDelegate!.send(
               CDVPluginResult(status: CDVCommandStatus_ERROR),
               callbackId: command.callbackId
            )
        }
    }

    @objc(activate:)
    func activate(command: CDVInvokedUrlCommand) {
        
        guard command.arguments.count > 0 else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
            return
        }
        
        if let paramDict = command.arguments[0] as? [String: Any] {
            if let keyTag = paramDict["clientID"] as? String {
                
                checkForReinstalling(keyTag)
                
                if getPublicKey(keyTag) != nil {
                    let resultDict:[String: Any] = ["success": "Activation succeeded. Key available."]

                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDict),
                        callbackId: command.callbackId
                    )
                } else {
                    if(generateKeyPair(keyTag)) {
                        let PEMPublicKey = exportToPEMKey(getPublicKey(keyTag))
                        
                        let resultDict:[String: Any] = ["publicKey": PEMPublicKey!]
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDict),
                            callbackId: command.callbackId
                        )
                    } else {
                        let resultDict:[String: Any] = ["error": "Activation failed."]
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                            callbackId: command.callbackId
                        )
                    }
                }
            } else {
                let resultDict:[String: Any] = ["error": "Invalid arguments."]
                self.commandDelegate!.send(
                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                    callbackId: command.callbackId
                )
            }
        } else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
        }
    }
    
    @objc(sign:)
    func sign(command: CDVInvokedUrlCommand) {
        guard command.arguments.count > 0 else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
            return
        }
        
        if let paramDict = command.arguments[0] as? [String:Any] {
            if let keyTag = paramDict["clientID"] as? String, let challenge = paramDict["challenge"] as? String {
                
                if (keyTag.count > 0) && (challenge.count > 0) {
                    let challengeData = challenge.data(using: .utf8)
                    
                    if let signatureData = self.sign(keyTag, challengeData) {
                        let signature = signatureData.base64EncodedString()
                        
                        let resultDict:[String: Any] = ["signature": signature]
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDict),
                            callbackId: command.callbackId
                        )
                    } else {
                        let resultDict:[String: Any] = ["error": "Signing failed. Key not found."]
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                            callbackId: command.callbackId
                        )
                    }
                } else {
                    let resultDict:[String: Any] = ["error": "Invalid arguments."]
                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                        callbackId: command.callbackId
                    )
                }
            } else {
                let resultDict:[String: Any] = ["error": "Invalid arguments."]
                self.commandDelegate!.send(
                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                    callbackId: command.callbackId
                )
            }
        } else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
        }
    }
    
    @objc(authenticate:)
    func authenticate(command: CDVInvokedUrlCommand) {
        guard command.arguments.count > 0 else {
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: "Invalid arguments."),
                callbackId: command.callbackId
            )
            return
        }
        
        // LocalAuthentication context
        let context = LAContext()
        context.localizedFallbackTitle = "" // Hide the passcode entry
        
        if let paramDict = command.arguments[0] as? [String:Any] {
            if let keyTag = paramDict["clientID"] as? String, let challenge = paramDict["challenge"] as? String {
                if (keyTag.count > 0) && (challenge.count > 0) {
                    
                    guard getPrivateKey(keyTag) != nil else {
                        let resultDict:[String: Any] = ["isValidKey": false]
                        self.commandDelegate!.send(
                            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                            callbackId: command.callbackId
                        )
                        return
                    }
                    
                    let challengeData = challenge.data(using: .utf8)
                    
                    // Check language and set Touch ID subtitle
                    var evaluateReason = "ยืนยัน Touch ID เพื่อเข้าใช้งาน"
                    let language = paramDict["lang"] as? String
                    
                    if (language == "en") {
                        evaluateReason = "Confirm Touch ID to login."
                    }
                    
                    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: evaluateReason) {
                        (success, evaluateError) in
                        
                        DispatchQueue.main.async {
                            if (success) {
                                if let signatureData = self.sign(keyTag, challengeData) {
                                    let signature = signatureData.base64EncodedString()
                                    
                                    let resultDict:[String: Any] = ["signature": signature]
                                    self.commandDelegate!.send(
                                        CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDict),
                                        callbackId: command.callbackId
                                    )
                                } else {
                                    let resultDict:[String: Any] = ["error": "Signing failed. Key not found."]
                                    self.commandDelegate!.send(
                                        CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                                        callbackId: command.callbackId
                                    )
                                }
                            } else {
                                var resultDict:[String: Any] = [:]
                                print("evaluateError?: \(evaluateError!._code)")
                                
                                if #available(iOS 11.0, *) {
                                    resultDict["isFaceIDPermitted"] = evaluateError!._code != LAError.biometryNotAvailable.rawValue
                                    
                                    if(evaluateError!._code == LAError.userCancel.rawValue) {
                                        // Check whether Face ID is locked.
                                        var authError: NSError?
                                        if(!context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &authError)) {
                                            print("authError?: \(authError!.code)")
                                            resultDict["isLocked"] = authError?.code == LAError.biometryLockout.rawValue
                                        }
                                    } else {
                                        // Otherwise, check for Touch ID.
                                        resultDict["isLocked"] = evaluateError!._code == LAError.biometryLockout.rawValue
                                    }
                                    
                                } else {
                                    resultDict["isLocked"] = evaluateError!._code == LAError.touchIDLockout.rawValue
                                }
                                
                                resultDict["error"] = "Authentication failed."
                                
                                self.commandDelegate!.send(
                                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                                    callbackId: command.callbackId
                                )
                            }
                        }
                        
                    }

                } else {
                    let resultDict:[String: Any] = ["error": "Invalid arguments."]
                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                        callbackId: command.callbackId
                    )
                }
            } else {
                let resultDict:[String: Any] = ["error": "Invalid arguments."]
                self.commandDelegate!.send(
                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                    callbackId: command.callbackId
                )
            }
        } else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
        }
        
    }
    
    @objc(deactivate:)
    func deactivate(command: CDVInvokedUrlCommand) {
        guard command.arguments.count > 0 else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
            return
        }
        
        if let paramDict = command.arguments[0] as? [String:Any] {
            if let keyTag = paramDict["clientID"] as? String {
                if (removePrivateKey(keyTag)) {
                    let resultDict:[String: Any] = ["success": "Deactivation succeeded. Key removed."]
                    self.commandDelegate!.send(
                        CDVPluginResult(status: CDVCommandStatus_OK, messageAs: resultDict),
                        callbackId: command.callbackId
                    )
                } else {
                    let resultDict:[String: Any] = ["error": "Deactivation failed. Key not found."]
                    self.commandDelegate!.send(
                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                    callbackId: command.callbackId
                    )
                }
            } else {
                let resultDict:[String: Any] = ["error": "Invalid arguments."]
                self.commandDelegate!.send(
                    CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                    callbackId: command.callbackId
                )
            }
        } else {
            let resultDict:[String: Any] = ["error": "Invalid arguments."]
            self.commandDelegate!.send(
                CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: resultDict),
                callbackId: command.callbackId
            )
        }
    }
    
    /**
     * Returns true if the device supports biometric authentication, otherwise false.
     */
    private func isAvailable() -> Bool {
        resultDicts = [:]
        
        let context = LAContext()
        var authError: NSError?
        var biometricType = "touchID"
        
        if(!context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &authError)) {
            let errorCode = authError!.code
            
            if #available(iOS 11.0, *) {
                switch errorCode {
                    case LAError.passcodeNotSet.rawValue:
                        resultDicts!["isEnrolled"] = false
                        break
                    case LAError.biometryNotEnrolled.rawValue:
                        resultDicts!["isEnrolled"] = false
                        break
                    case LAError.biometryNotAvailable.rawValue:
                        resultDicts!["isFaceIDPermitted"] = false
                        break
                case LAError.biometryLockout.rawValue:
                        resultDicts!["isLocked"] = true
                        break
                    default:
                        break
                }
            } else {
                // Fallback on earlier versions
                switch errorCode {
                    case LAError.touchIDNotAvailable.rawValue:
                        resultDicts!["isDeviceSupported"] = false
                        break
                    case LAError.passcodeNotSet.rawValue:
                        resultDicts!["isEnrolled"] = false
                        break
                    case LAError.touchIDNotEnrolled.rawValue:
                        resultDicts!["isEnrolled"] = false
                        break
                    case LAError.touchIDLockout.rawValue:
                        resultDicts!["isLocked"] = true
                        break
                    default:
                        break
                }
            }
            
            resultDicts!["isAvailable"] = false
        } else {
            resultDicts!["isAvailable"] = true
        }
        
        // Check biometric type after biometryType set by canEvaluatePolicy()
        if #available(iOS 11.0, *) {
            if(context.biometryType.rawValue == LABiometryType.faceID.rawValue){
                biometricType = "faceID"
            }
        }
        resultDicts!["biometricType"] = biometricType
        
        return resultDicts!["isAvailable"] as! Bool
    }
    
    private func isBioStateChanged() -> Bool {
        let context = LAContext()
        
        guard let oldState = getBiometricState() else {
            return false
        }
        
        if(context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil)) {
            let currentState = context.evaluatedPolicyDomainState?.base64EncodedString()
            
            if(oldState != currentState) {
                return true
            }
        }
        
        return false
    }
    
    private func setBiometricState() -> Bool {
        let context = LAContext()
          
        if(context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil)) {
            let state = context.evaluatedPolicyDomainState?.base64EncodedString()
            UserDefaults.standard.set(state, forKey: "BiometricState")
            
            return true
        } else {
            return false
        }
    }
     
    private func getBiometricState() -> String? {
        return UserDefaults.standard.string(forKey: "BiometricState")
    }

    /**
     * Generates a key pair and store a private key in the keychain.
     * Returns true if the key pair is generated, otherwise false.
     */
    private func generateKeyPair(_ keyTag: String) -> Bool {
        let attributes: [String: Any] = [
            kSecAttrKeyType as String:           keyType,
            kSecAttrKeySizeInBits as String:     keySize,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent:      true,
                kSecAttrApplicationTag:   keyTag,
            ]
        ]
        
        var error: Unmanaged<CFError>?
        SecKeyCreateRandomKey(attributes as CFDictionary, &error)
        
        if (error != nil) {
            NSLog(error!.takeRetainedValue().localizedDescription)
            return false
        }
        
        return true
    }
    
    /**
     * Returns a key attribute used to search for a private key in the keychain.
     */
    private func getQuery(_ keyTag: String) -> CFDictionary {
        let query: [String: Any] = [kSecClass as String: kSecClassKey,
                                    kSecAttrApplicationTag as String: keyTag as Any,
                                    kSecAttrKeyType as String: keyType as Any,
                                    kSecReturnRef as String: true]
        
        return query as CFDictionary
    }
    
    /**
     * Returns a private key that matches the specified attribute.
     */
    private func getPrivateKey(_ keyTag: String) -> SecKey? {
        var item: CFTypeRef?
        let status = SecItemCopyMatching(getQuery(keyTag), &item)
        guard status == errSecSuccess else {
            return nil
        }
        let privateKey = item as! SecKey
        
        return privateKey
    }
    
    /**
     * Returns a public key corresponding to the given private key.
     */
    private func getPublicKey(_ keyTag: String!) -> SecKey? {
        guard let privateKey = getPrivateKey(keyTag) else {
            return nil
        }
        
        return SecKeyCopyPublicKey(privateKey)
    }
    
    /**
     * Exports the specified public key so it can be used outside iOS (i.e: in OpenSSL).
     * Returns a PEM representation of the key.
     */
    private func exportToPEMKey(_ publicKey: SecKey!) -> String? {
        guard publicKey != nil else {
            return nil
        }
        var error: Unmanaged<CFError>?
        guard let publicKeyData = SecKeyCopyExternalRepresentation(publicKey, &error) else {
            return nil
        }
        let exportableDERKey = exportRSAToDER(publicKeyData as Data)
        let exportablePEMKey = exportDERToPEM(exportableDERKey)
        
        return exportablePEMKey
    }
    
    /**
     * This function prepares a RSA public key generated with Apple SecKeyCreateRandomKey to be exported
     * and used outisde iOS, be it openSSL, PHP, Perl, whatever. By default Apple exports RSA public
     * keys in a very raw format. If we want to use it on OpenSSL, PHP or almost anywhere outside iOS, we
     * need to remove add the full PKCS#1 ASN.1 wrapping. Returns a DER representation of the key.
     */
    private func exportRSAToDER(_ rawPublicKeyBytes: Data) -> Data {
        // first we create the space for the ASN.1 header and decide about its length
        let bitstringEncodingLength = bytesNeededForRepresentingInteger(rawPublicKeyBytes.count)
        
        // start building the ASN.1 header
        var headerBuffer = [UInt8](repeating: 0, count: ASNHeaderLengthForRSA);
        headerBuffer[0] = ASNHeaderSequenceMark;
        
        // total size (OID + encoding + key size) + 2 (marks)
        let totalSize = RSAOIDHeaderLength + bitstringEncodingLength + rawPublicKeyBytes.count + 3
        let totalSizebitstringEncodingLength = encodeASN1LengthParameter(totalSize, buffer: &(headerBuffer[1]))
        
        // bitstring header
        var keyLengthBytesEncoded = 0
        var bitstringBuffer = [UInt8](repeating: 0, count: ASNHeaderLengthForRSA);
        bitstringBuffer[0] = ASNHeaderBitstringMark
        keyLengthBytesEncoded = encodeASN1LengthParameter(rawPublicKeyBytes.count+1, buffer: &(bitstringBuffer[1]))
        bitstringBuffer[keyLengthBytesEncoded + 1] = 0x00
        
        // build DER key.
        var derKey = Data(capacity: totalSize + totalSizebitstringEncodingLength)
        derKey.append(headerBuffer, count: totalSizebitstringEncodingLength + 1)
        derKey.append(RSAOIDHeader, count: RSAOIDHeaderLength) // Add OID header
        derKey.append(bitstringBuffer, count: keyLengthBytesEncoded + 2) // 0x03 + key bitstring length + 0x00
        derKey.append(rawPublicKeyBytes) // public key raw data.
        
        return derKey
    }
    
    /**
     * Returns the number of bytes needed to represent an integer.
     */
    private func bytesNeededForRepresentingInteger(_ number: Int) -> Int {
        if number <= 0 { return 0 }
        var i = 1
        while (i < 8 && number >= (1 << (i * 8))) { i += 1 }
        
        return i
    }
    
    /**
     * Generates an ASN.1 length sequence for the given length. Modifies the buffer parameter by
     * writing the ASN.1 sequence. The memory of buffer must be initialized (i.e: from an NSData).
     * Returns the number of bytes used to write the sequence.
     */
    private func encodeASN1LengthParameter(_ length: Int, buffer: UnsafeMutablePointer<UInt8>) -> Int {
        if length < Int(ASNExtendedLengthMark) {
            buffer[0] = UInt8(length)
            
            return 1 // just one byte was used, no need for length starting mark (0x80).
        } else {
            let extraBytes = bytesNeededForRepresentingInteger(length)
            var currentLengthValue = length
            
            buffer[0] = ASNExtendedLengthMark + UInt8(extraBytes)
            for i in 0 ..< extraBytes {
                buffer[extraBytes - i] = UInt8(currentLengthValue & 0xff)
                currentLengthValue = currentLengthValue >> 8
            }
            
            return extraBytes + 1 // 1 byte for the starting mark (0x80 + bytes used) + bytes used to encode length.
        }
    }
    
    /**
     * This method transforms a DER encoded key to PEM format. It gets a Base64 representation of
     * the key and then splits this base64 string in 64 character chunks. Then it wraps it in
     * BEGIN and END key tags.
     */
    private func exportDERToPEM(_ data: Data) -> String {
        // base64 encode the result
        let base64EncodedString = data.base64EncodedString(options: [])
        
        // split in lines of 64 characters.
        var currentLine = ""
        var resultString = publicKeyInitialTag
        var charCount = 0
        for character in base64EncodedString {
            charCount += 1
            currentLine.append(character)
            if charCount == publicKeyCharInLine {
                resultString += currentLine + "\n"
                charCount = 0
                currentLine = ""
            }
        }
        // final line (if any)
        if currentLine.count > 0 { resultString += currentLine + "\n" }
        // final tag
        resultString += publicKeyFinalTag
        
        return resultString
    }
    
    /**
     * Sign data with the given private key.
     * Returns a signature created, otherwise nil.
     */
    private func sign(_ keyTag: String!, _ data: Data!) -> NSData? {
        guard let privateKey = getPrivateKey(keyTag) else {
            return nil
        }
        let algorithm: SecKeyAlgorithm = SecKeyAlgorithm.rsaSignatureMessagePKCS1v15SHA256
        
        var error: Unmanaged<CFError>?
        let signature = SecKeyCreateSignature(privateKey,
                                              algorithm,
                                              data as CFData,
                                              &error) as NSData?
        
        if(error != nil) {
            NSLog(error!.takeRetainedValue().localizedDescription)
        }
        
        return signature
    }
    
    /**
     * Returns true if a private key that matches the specified attribute is removed from the keychain.
     */
    private func removePrivateKey(_ keyTag: String!) -> Bool {
        let status = SecItemDelete(getQuery(keyTag))
        guard status == errSecSuccess else {
            return false
        }
        
        return true
    }
    
    /**
     * UserDefaults has limited storage and cannot store value with duplicate keys.
     */
    private func checkForReinstalling(_ keyTag: String!) {
        if(!UserDefaults.standard.bool(forKey: keyTag)) {
            // In case of reinstalling
            if(removePrivateKey(keyTag)) {
                NSLog("Reinstalling detected. Private key removed.")
            }
            UserDefaults.standard.set(true, forKey: keyTag)
        }
    }
    
    //    private func sendPluginResult(status: CDVCommandStatus, callBackID: String, message: [String: Any]) {
    //    }
    
}
