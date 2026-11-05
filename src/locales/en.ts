import type { Messages } from './mn';

export const en: Messages = {
  common: {
    cancel: 'Cancel',
    searchCountry: 'Search country or code',
    noCountry: 'No match',
    countryCode: 'Country code',
    save: 'Save',
    change: 'Change',
    soon: 'Soon',
    optional: '(optional)',
    login: 'Sign in',
    signup: 'Sign up',
    logout: 'Sign out',
    back: 'Back',
    verified: 'Verified',
    unknown: 'Unknown',
    notSet: 'Not provided',
    lastName: 'Last name',
    firstName: 'First name',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    phoneNumber: 'Phone number',
    registerNumber: 'Registration number',
    password: 'Password',
    passwordConfirm: 'Confirm password',
    newPassword: 'New password',
    newPasswordConfirm: 'Confirm new password',
  },
  theme: {
    light: 'Light mode',
    dark: 'Dark mode',
  },
  language: {
    label: 'Language',
    mn: 'Монгол',
    en: 'English',
  },
  brand: {
    tagline: 'Bonds',
  },
  publicLayout: {
    slides: {
      invest: {
        title: 'Invest in private bonds with confidence',
        text: 'Track your investments, returns and payment schedule in one place.',
      },
      transparent: {
        title: 'Clear terms, every document at hand',
        text: 'Your contracts, certificates and payment history, always available.',
      },
      secure: {
        title: 'Your data stays protected',
        text: 'Every sign-in is verified and your data is stored encrypted.',
      },
    },
    previous: 'Previous',
    next: 'Next',
    slide: 'Slide {{n}}',
    rights: 'All rights reserved.',
  },
  nav: {
    general: 'General',
    investment: 'Investments',
    account: 'Account',
    dashboard: 'Dashboard',
    bonds: 'Bonds',
    contracts: 'Contracts & certificates',
    profile: 'Profile',
    security: 'Security',
    comingSoon: '{{title}} (coming soon)',
  },
  status: {
    pending: 'Pending',
    approved: 'Verified',
    rejected: 'Rejected',
  },
  clientType: {
    customer: 'Mongolian citizen',
    foreign: 'Foreign national',
    organization: 'Organization',
    org_member: 'Organization member',
  },
  password: {
    rules: {
      length: 'At least 8 characters',
      upper: 'Uppercase letter',
      lower: 'Lowercase letter',
      digit: 'Number',
      symbol: 'Special character (!@#$%...)',
    },
    tooLong: 'Password is too long',
    weak: 'Password does not meet the requirements',
    match: 'Passwords match',
    mismatch: 'Passwords do not match',
    confirmRequired: 'Re-enter your password',
    show: 'Show password',
    hide: 'Hide password',
  },
  validation: {
    tooLong: 'Too long',
    lastNameRequired: 'Enter your last name',
    firstNameRequired: 'Enter your first name',
    emailInvalid: 'Enter a valid email address',
    phoneDigits: 'Enter a valid phone number. Mongolian numbers have 8 digits.',
    phoneCountry:
      "This number does not fit the selected country's phone numbers.",
    orgNameRequired: "Enter the organization's name",
  },
  login: {
    title: 'Welcome back',
    description: 'Sign in to your account to manage your investments.',
    noAccount: "Don't have an account?",
    loginRequired: 'Enter your email or phone number',
    loginInvalid:
      'Enter an email or a phone number. Write a foreign number with its country code (+86...).',
    passwordRequired: 'Enter your password',
    orgRegisterInvalid: 'Organization registration number must be 7 digits',
    loginLabel: 'Email or phone',
    loginPlaceholder: 'name@example.com or 99112233',
    forgot: 'Forgot password?',
    locked:
      'Your account is temporarily locked after too many failed attempts. Try again in {{time}}.',
    throttled: 'Too many attempts. Try again in {{time}}.',
    wait: 'Please wait ({{time}})',
  },
  signup: {
    title: 'Create an account',
    description:
      'How would you like to register? The account type cannot be changed after sign-up.',
    hints: {
      customer: 'With a Mongolian national ID',
      foreign: 'With a foreign passport',
      organization: 'Legal entity',
    },
    orgNote: 'Registered organizations sign in with their registration number.',
    detailsTitle: 'Enter your details',
    changeType: 'Change type',
    step: 'Step {{step}} of 2',
    emailHintForeign:
      'Your verification code will be sent here. You will sign in with this email.',
    emailHintCustomer: 'You can sign in with your email or phone number.',
    phoneHint: 'Your verification code will be sent to this number by SMS.',
    org: {
      registerNumber: 'Organization registration number',
      registerHint: 'You will sign in with this number.',
      representative: 'The person signing up for the organization',
      representativeText:
        "Your details. You will be registered as the organization's first officer. The organization's name and other details come after you sign in.",
      emailHint: 'Your email. We send notices here.',
    },
    haveAccount: 'Already have an account?',
  },
  otp: {
    sentSms: 'We sent a 6-digit code to <strong>{{to}}</strong>.',
    sentEmail: 'We sent a 6-digit code to <strong>{{to}}</strong>.',
    sentUnknown:
      'If the account exists, we sent a 6-digit code to its phone (or email for foreign nationals).',
    codeLabel: 'Verification code',
    expired: 'The code has expired. Request a new one.',
    validFor: 'Code valid for {{time}}',
    throttled: 'Wait {{time}} before requesting a new code.',
    resendIn: 'Resend ({{time}})',
    resend: 'Resend code',
    submit: 'Verify',
  },
  verify: {
    titleSms: 'Verify your phone number',
    titleEmail: 'Verify your email',
    description: 'Enter the code we sent to activate your account.',
    success: 'Your account has been verified',
  },
  forgot: {
    steps: {
      login: 'Username',
      code: 'Code',
      password: 'New password',
    },
    stepsLabel: 'Steps',
    doneTitle: 'Password updated',
    doneText:
      'For your security, you have been signed out of all devices. Sign in with your new password.',
    title: 'Reset password',
    descLogin:
      'Enter your registered email or organization registration number.',
    descCode: 'Enter the 6-digit code we sent you.',
    descPassword: 'Enter your new password twice.',
    backToLogin: 'Back to sign in',
    restart: 'Start over',
    continue: 'Continue',
    loginRequired: 'Enter your email or registration number',
    loginInvalid: 'Enter an email or a 7-digit registration number',
    loginLabel: 'Email or organization registration number',
    getCode: 'Get code',
    getCodeAgain: 'Get a new code',
    submit: 'Update password',
    within: 'Update your password within 10 minutes of verifying the code.',
  },
  home: {
    greeting: {
      night: 'Hello',
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
    progressTitle: 'Registration progress',
    progressText:
      'Once you complete the steps below, you will be able to buy bonds.',
    rejectedTitle: 'Your application was not approved',
    reason: 'Reason:',
    resubmitHint:
      'Once you update your details, your application will be reviewed again.',
    editInfo: 'Edit details',
    completeTitle: 'Complete your details',
    completeText:
      'We need the following details to review your account. Our team will review it once it is complete.',
    submitForReview: 'Submit for review',
    orgCompleteText:
      'Once both steps below are done, your application goes to review automatically.',
    orgSteps: {
      info: 'Organization details',
      infoHint: 'Name, line of business, address',
      position: 'Your position',
      positionHint: 'Enter it in the officers list',
    },
    totalInvestment: 'Total investment',
    approvedText:
      'Your account is verified. Choose your first bond to start investing.',
    viewBonds: 'View bonds',
    myInfo: 'My details',
    activeBonds: 'Active bonds',
    nextPayment: 'Next payment',
    none: 'None',
    offersSoon: 'Bond offerings coming soon',
    offersSoonText:
      'We will notify you when new bonds are available. Meanwhile, review your details and security settings.',
    profileLink: 'Contact details, email, password',
    securityLink: 'Signed-in devices',
    kyc: {
      account: 'Account',
      info: 'Details',
      infoDone: 'Completed',
      infoTodo: 'Required',
      review: 'Review',
      reviewFailed: 'Rejected',
      reviewDone: 'Reviewed',
      reviewTime: 'Within 24 hours',
      verified: 'Verified',
    },
    pending: {
      stillReviewing: 'Your application is still under review. Please wait.',
      title: 'Application under review',
      text: 'Our team will review your details and respond on a business day. Once verified, it will show here right away.',
      checkAgain: 'Check again',
      viewInfo: 'View details',
    },
  },
  profile: {
    description: 'View and update your account details.',
    memberSince: 'Member since {{date}}',
    basicInfo: 'Basic information',
    orgInfo: 'Organization details',
    memberInfo: 'My details',
    memberInfoText:
      'You use the services on behalf of your organization. Your own details change in the officers list.',
    lockedCustomer:
      'Your name and registration number are verified and locked. You can still update your phone, address and bank account.',
    lockedOther:
      'Verified details are locked. You can still update your contact details.',
    reviewHint: 'Our team will review your details once they are complete.',
    position: 'Position',
    emailText: 'Used for signing in and receiving codes.',
    changePassword: 'Change password',
    changePasswordText:
      'After changing it, you will be signed out of all other devices.',
  },
  changeEmail: {
    title: 'Change email',
    codeText: 'Enter the code we sent to your new address.',
    emailText:
      'We will send a verification code to your new email. Your email changes only after you enter it.',
    sameEmail: 'Enter an address different from your current one',
    newEmail: 'New email',
    sendCode: 'Send code',
    success: 'Email address updated',
  },
  changePassword: {
    currentRequired: 'Enter your current password',
    sameAsCurrent: 'New password must differ from your current one',
    success: 'Password changed. You have been signed out of other devices.',
    current: 'Current password',
    locked: 'Temporarily locked. Try again in {{time}}.',
    submit: 'Change password',
  },
  details: {
    errors: {
      register:
        'Registration number is 2 Cyrillic letters and 8 digits (e.g. УБ12345678)',
      bank: 'Select your bank',
      accountNumber: 'Account number must be 6-20 digits',
      iban: 'IBAN must be MN followed by 18 digits',
      ibanChecksum: 'This IBAN is not valid. Please check it',
      ibanMismatch: 'The account number does not match the IBAN',
      holderAccountName: "Enter the account holder's name",
      nationality: 'Select your nationality',
      passport: 'Enter your passport number',
      activity: 'Enter your line of business',
      address: 'Enter your address',
    },
    nothingToChange: 'Nothing to update',
    resubmitted: 'Details updated and resubmitted for review',
    taxRequested: 'Tax exemption request submitted',
    saved: 'Details saved',
    lockHint: 'Cannot be changed after verification',
    orgInfo: 'Organization details',
    activity: 'Line of business',
    activityPlaceholder: 'e.g. Construction materials trading',
    address: 'Address',
    orgAddressPlaceholder: 'District, khoroo, street, building, unit',
    orgName: 'Organization name',
    orgNamePlaceholder: 'e.g. Altan Gobi LLC',
    personal: 'Personal details',
    registerHint: 'e.g. УБ12345678',
    nationality: 'Nationality',
    select: 'Select',
    passportNumber: 'Passport number',
    contact: 'Contact',
    phoneSecondary: 'Secondary phone',
    homeAddress: 'Home address',
    homeAddressPlaceholder: 'District, khoroo, building, unit',
    bankAccount: 'Bank account',
    bankAccountText:
      'Bond interest and principal are paid into this account. You can change it later.',
    bank: 'Bank',
    selectBank: 'Select bank',
    accountNumber: 'Account number',
    iban: 'IBAN',
    ibanHint: 'Find it in your banking app or account statement.',
    holderAccountName: "Account holder's name",
    holderAccountNameHint: 'As registered with the bank, e.g. Bat Dorj.',
    holderAccountNameOrgHint:
      "The organization's name as registered with the bank.",
    orgBankAccountText:
      "Bond interest and principal are paid into this organization account. It must be in the organization's name.",
    bankVerification: {
      title: 'Account verification',
      verified: 'Account verified',
      notVerified: 'Account not verified',
      verifiedText:
        "The holder's name in the bank's record matches the name you registered.",
      notVerifiedText:
        'Verify the account against the bank record before money is sent to it.',
      saveFirst:
        'Save the account details first. You can verify the account once they are saved.',
      verify: 'Verify account',
      verifying: 'Verifying...',
      reverify: 'Verify again',
      verifiedToast: 'Your bank account is verified.',
      mismatch:
        "The bank's record names someone else. Check the holder's name and try again.",
      notFound:
        'The bank does not know this account. Check the account number and IBAN.',
    },
    tax: {
      title: 'Interest income tax exemption',
      requested: 'Under review',
      approved: 'Approved',
      rejected: 'Rejected',
      rejectedText:
        'Your request was rejected. To request again, check the box and save.',
      approvedText:
        'Exemption approved. Uncheck the box and save to cancel it.',
      text: 'Check this if you are eligible for the exemption. Our team will review it. Unchecking cancels the request.',
    },
  },
  members: {
    title: 'Officers',
    you: 'You',
    description:
      'The officers who represent the organization. Each signs in with their own phone or email and uses the services on its behalf. A new officer sets their first password through "Forgot password?".',
    lockedText:
      'Your account is verified, so officer details can no longer be changed.',
    emptyTitle: 'Register your first officer',
    emptyText:
      'Add an officer who represents the organization, such as the chief executive, with their position.',
    emptyLocked: 'No officers registered.',
    add: 'Add',
    addFirst: 'Add an officer',
    addTitle: 'Add an officer',
    editTitle: 'Officer details',
    dialogText:
      "Enter the officer's position, last name, first name, phone and email.",
    edit: 'Edit',
    remove: 'Remove',
    removeTitle: 'Remove this officer?',
    removeText: '{{name}} will be removed from the list.',
    positionMissing: 'Enter your position',
    position: 'Position',
    positionPlaceholder: 'e.g. Chief executive',
    positions: {
      ceo: 'Chief executive',
      director: 'Director',
      chiefAccountant: 'Chief accountant',
    },
    inactive: 'Inactive',
    added: 'Officer added',
    saved: 'Officer details saved',
    removed: 'Officer removed',
    errors: {
      lastName: 'Enter the last name',
      firstName: 'Enter the first name',
      position: 'Enter the position',
    },
  },
  bankAccounts: {
    title: 'Bank accounts',
    description:
      'Bond interest and principal are paid into the default account of each currency. You can register several accounts in MNT and USD.',
    orgDescription:
      "Bond interest and principal are paid into the organization's default account of each currency. Accounts must be in the organization's name.",
    add: 'Add account',
    addFirst: 'Add your first account',
    addTitle: 'Add bank account',
    editTitle: 'Edit bank account',
    dialogText:
      "Enter the bank, account number, IBAN and holder's name as registered with the bank.",
    editText: 'Changing the details means the account must be verified again.',
    empty: 'No bank account is registered yet.',
    currency: 'Currency',
    currencies: {
      MNT: 'Tugrik (MNT)',
      USD: 'US dollar (USD)',
    },
    default: 'Default',
    makeDefault: 'Make default',
    makeDefaultLabel: 'Make it the default account for this currency',
    makeDefaultText:
      "Payments in a currency go to its default account. A currency's first account becomes its default automatically.",
    currencyChangeText:
      'Changing the currency means the account is no longer a default.',
    edit: 'Edit',
    remove: 'Remove',
    removeTitle: 'Remove this account?',
    removeText: 'The {{bank}} account {{account}} will be removed.',
    removeDefaultText:
      'It is a default account, so the oldest other account of its currency becomes the default.',
    lastAccountTitle: 'The last account cannot be removed',
    added: 'Bank account added',
    saved: 'Bank account saved',
    removed: 'Bank account removed',
    defaultSet: 'The default {{currency}} account changed',
    status: {
      unverified: 'Unverified',
      verified: 'Verified',
      mismatch: 'Name mismatch',
      not_found: 'Not found at the bank',
    },
  },
  banks: {
    khan: 'Khan Bank',
    golomt: 'Golomt Bank',
    tdb: 'Trade and Development Bank',
    xac: 'XacBank',
    state: 'State Bank',
    capitron: 'Capitron Bank',
    bogd: 'Bogd Bank',
    trans: 'TransBank',
    arig: 'Arig Bank',
    m: 'M Bank',
    nib: 'National Investment Bank',
    chinggis: 'Chinggis Khaan Bank',
    transport: 'Transport and Development Bank',
  },
  countries: {
    CN: 'China',
    RU: 'Russia',
    KR: 'South Korea',
    JP: 'Japan',
    US: 'United States',
    KZ: 'Kazakhstan',
    DE: 'Germany',
    GB: 'United Kingdom',
  },
  security: {
    description:
      'Devices signed in to your account. If you see one you do not recognize, sign it out and change your password.',
    activeSessions: 'Active sessions',
    sessionCount_one: '{{count}} active session',
    sessionCount_other: '{{count}} active sessions',
    loading: 'Loading',
    signOutOthers: 'Sign out others',
    othersTitle: 'Sign out of all other devices?',
    othersText: 'Every session except this device will end immediately.',
    othersDone: 'Signed out of other devices',
    unknownDevice: 'Unknown device',
    thisDevice: 'This device',
    thisDeviceFallback: 'this device',
    signedIn: 'Signed in {{date}}',
    lastActive: 'Last active {{date}}',
    signOut: 'Sign out',
    endTitle: 'End this session?',
    endText: 'The session on {{device}} will end immediately.',
    ended: 'Session ended',
    forget: 'Forget device',
    forgetTitle: 'Forget this device?',
    forgetText:
      'All sessions in this browser will end, and its next sign-in will register as a new device.',
    forgetConfirm: 'Forget',
    forgotten: 'Device forgotten',
  },
  issuer: {
    nav: {
      general: 'General',
      bonds: 'Bonds',
      dashboard: 'Dashboard',
      contracts: 'Contracts',
      schedule: 'Schedule',
    },
    contracts: {
      title: 'Contracts',
      description:
        'Contracts every client party has signed. The chief executive signs or declines each, for a reason, within 72 hours; one left unsigned becomes void.',
      tabs: {
        pending: 'Pending',
        valid: 'Valid',
        cancelled: 'Cancelled',
      },
      empty: {
        pending:
          'No contract awaits a signature. Contracts arrive here once their client parties sign them.',
        valid: 'Contracts every party has signed appear here.',
        cancelled: 'Declined and expired contracts appear here.',
      },
      columns: {
        contractNo: 'Number',
        client: 'Client',
        bond: 'Bond',
        amount: 'Amount',
        term: 'Term',
        date: 'Date',
        deadline: 'Deadline',
        status: 'Status',
      },
      withCoHolder: 'Co-holder: {{name}}',
      hoursLeft_one: '{{count}} hour left',
      hoursLeft_other: '{{count}} hours left',
      overdue: 'Deadline passed',
      pageInfo: '{{from}}-{{to}} of {{total}}',
      prev: 'Previous',
      next: 'Next',
      toList: 'Contracts',
      heading: 'Contract {{no}}',
      subheading: '{{code}} bond · {{date}}',
      state: {
        pending: "Awaiting the chief executive's signature",
        pendingText:
          'Every client party has signed. The chief executive signs it, or declines it for a reason, by {{deadline}}.',
        overdueText:
          'The signing deadline has passed, so the contract will soon become void.',
        directorSigns: 'The chief executive signs it.',
        rendering: 'Preparing the final copy',
        renderingText:
          'Every party has signed. This page updates once the final copy is ready.',
        slowText:
          'Preparing the final copy is taking longer than usual. Press "Check again".',
        signed: 'The contract is valid',
        signedText: 'Every party signed it: {{date}}.',
        failed: 'The final copy could not be prepared',
        failedText:
          'Every party has signed, but preparing the final copy failed. Ulzii & Co staff will check it and prepare it.',
        cancelled: 'The contract was cancelled',
        cancelledText: 'The chief executive {{name}} declined it: {{date}}.',
        expired: 'Expired',
        expiredText:
          'The chief executive did not sign it within 72 hours, so the contract became void: {{date}}.',
        refund: "The client's payment is refunded.",
      },
      actions: {
        sign: 'Sign',
        decline: 'Decline',
      },
      decline: {
        title: 'Decline the contract?',
        text: "The contract is cancelled for every party and the client's payment is refunded. The client and Ulzii & Co staff read your reason.",
        reason: 'Reason',
        placeholder: 'Why do you decline the contract?',
        submit: 'Decline',
        done: 'The contract was declined.',
      },
      client: {
        title: 'Client',
        holder: 'Holder',
        co_holder: 'Co-holder',
        name: 'Name',
        registerNo: 'Register / passport',
        phone: 'Phone',
        account: 'Repayment account',
        bank: 'Bank',
        owner: 'Account holder',
        accountNo: 'Account number',
        iban: 'IBAN',
      },
      parties: {
        title: 'Parties',
        client: 'Client',
        issuer: 'Bond issuer',
        underwriter: 'Underwriter',
        director: 'Chief executive: {{name}}',
        signed: 'Signed',
        declined: 'Declined',
        awaited: 'Awaiting',
        unsigned: 'Not signed',
        noSignature: 'Does not sign',
      },
      document: {
        title: 'The contract',
        pending:
          "A preview with the client parties' signatures. The final copy is prepared once the chief executive signs.",
      },
      sign: {
        title: 'Sign the contract',
        description:
          'Sign contract {{no}} as the chief executive. Your signature makes it valid.',
      },
    },
    loginLink: 'A bond issuer?',
    loginLinkAction: 'Sign in as an issuer',
    clientLink: 'A client?',
    clientLinkAction: 'Sign in as a client',
    loginTitle: 'Bond issuer sign-in',
    loginDescription:
      'Staff of a bond issuer registered by Ulzii & Co sign in with their own email.',
    emailRequired: 'Enter your email',
    emailInvalid: 'The email is not valid',
    title: 'Bond issuer',
    company: 'Company',
    companyName: 'Company name',
    stateRegisterNumber: 'State registration number',
    members: 'Members',
    membersText:
      'Ulzii & Co staff register members and give them their passwords.',
    bankAccounts: 'Bank accounts',
    bankAccountsText: 'The money your bonds raise is paid into these accounts.',
    defaultAccount: 'Default',
    noBankAccounts: 'No bank account is registered yet.',
    accountName: 'Account holder',
    accountNumber: 'Account number',
    you: 'You',
    blocked: 'Inactive',
    role: {
      director: 'Chief executive',
      staff: 'Staff',
    },
    bankStatus: {
      unverified: 'Unverified',
      verified: 'Verified',
      mismatch: 'Name mismatch',
      not_found: 'Not found at the bank',
    },
  },
  session: {
    expired: 'Your session has expired. Please sign in again.',
  },
  device: {
    browser: 'Browser',
  },
  apiError: {
    generic: 'Something went wrong. Please try again.',
    genericShort: 'Something went wrong.',
  },
  contract: {
    page: {
      title: 'Contracts & certificates',
      description:
        'Read and sign the contracts of the bonds you bought. Download your signed contracts here.',
      buy: 'Buy a bond',
    },
    toList: 'Contracts',
    back: 'Back',
    bond: '{{name}} bond',
    months_one: '{{count}} month',
    months_other: '{{count}} months',
    unnumbered: 'Not numbered yet',
    payment: {
      title: 'Pay',
      description:
        'Transfer to the account below with the payment reference exactly as shown. Once the money arrives, your contract moves on to signing.',
      recipient: 'Recipient',
      bank: 'Bank',
      account: 'Account number',
      iban: 'IBAN',
      amount: 'Amount to pay',
      reference: 'Payment reference',
      referenceHint:
        'Write only this code as the transfer description. A transfer with another description is not recognised automatically.',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Could not copy',
      noAccount:
        'No account is registered to receive the payment. Please contact our staff.',
      deadline: 'Pay by',
      left: '{{time}} left',
      waiting: 'Checking for your payment',
      waitingText:
        'It is confirmed automatically a few minutes after you transfer. You may close this page.',
      received: 'Received: {{received}}',
      short: 'Short by {{left}}. Transfer the rest with the same reference.',
      mock: 'Continue (test)',
      mockText: 'Test mode: the button counts the payment as received.',
      paid: 'Payment received. Read and sign contract {{no}}.',
      cancel: 'Cancel the order',
      cancelTitle: 'Cancel your order?',
      cancelText:
        'The order is cancelled and its payment reference no longer works. You may order again.',
      expiredTitle: 'The payment deadline passed',
      expired:
        'The payment did not arrive in time, so the order lapsed. Any money received is refunded.',
      cancelled: 'You cancelled the order.',
    },
    steps: {
      create: {
        label: 'Order',
        hint: 'Terms and amount',
      },
      pay: {
        label: 'Payment',
        hint: 'Bank transfer',
      },
      view: {
        label: 'Read the contract',
        hint: 'Review the terms',
      },
      sign: {
        label: 'Signature',
        hint: 'From your account',
      },
      done: {
        label: 'Confirmed',
        hint: 'Download the original',
      },
    },
    sections: {
      create: {
        title: 'Choose a bond',
        description: '',
      },
      pay: {
        title: 'Pay',
        description:
          'Transfer to the account below with the payment reference exactly as shown. Once the money arrives, your contract moves on to signing.',
      },
      view: {
        title: 'Review the contract',
        description: 'Read the terms and the contract carefully.',
      },
      sign: {
        title: 'Sign the contract',
        description: 'Draw your own signature.',
      },
      done: {
        title: 'Contract',
        description: 'You can download the original once it is ready.',
      },
    },
    status: {
      draft: 'Draft',
      pending_payment: 'Awaiting payment',
      pending_customer_signature: 'Awaiting signatures',
      pending_issuer_signature: "Awaiting the issuer's signature",
      rendering: 'Preparing',
      signed: 'Confirmed',
      cancelled: 'Cancelled',
      expired: 'Expired',
      failed: 'Failed',
    },
    frequency: {
      monthly: 'Monthly',
      bimonthly: 'Every two months',
      quarterly: 'Quarterly',
      semi_annual: 'Every six months',
      annual: 'Annually',
      at_maturity: 'At maturity',
    },
    party: {
      holder: 'Buyer',
      co_holder: 'Co-holder',
      issuer: 'Issuer',
      organization: 'Organization',
      guardian: 'Guardian',
      minor: 'Minor holder',
    },
    partyState: {
      signed: 'Signed',
      declined: 'Declined',
      awaited: 'Awaiting',
      unsigned: 'Not signed',
    },
    list: {
      title: 'My contracts',
      count_one: '{{count}} contract',
      count_other: '{{count}} contracts',
      loading: 'Loading contracts...',
      awaitingYou: 'Awaiting your signature',
      awaitingTitle: 'Waiting for your signature ({{count}})',
      othersTitle: 'Other contracts',
      emptyTitle: 'No contracts yet',
      emptyText: 'Your contracts appear here once you buy a bond.',
    },
    coHolder: {
      title: 'Co-holder',
      description: 'Name the client who holds the bond with you.',
      intro:
        'The co-holder must be an approved client. Enter the register number (a passport number for a foreigner) and the phone number they signed up with. They sign the contract from their own account.',
      registerNo: 'Register or passport number',
      registerNoPlaceholder: 'УБ12345678',
      registerNoRequired: "Enter the co-holder's register or passport number",
      phone: 'Phone number',
      submit: 'To the contract',
      change: 'Change the co-holder',
    },
    terms: {
      title: 'Contract terms',
      contractNo: 'Contract number',
      amount: 'Amount',
      annualRate: 'Annual rate',
      term: 'Term',
      frequency: 'Interest paid',
      maturity: 'Maturity date',
    },
    document: {
      title: 'The contract',
      description: 'Read the whole contract before you sign it.',
      failed: 'Could not show the contract.',
    },
    toSign: 'Sign',
    sign: {
      back: 'Back to the contract',
      submit: 'Sign',
      sending: 'Sending...',
      agree: 'I have read the terms of the contract in full and agree to them.',
      clear: 'Clear',
      padHint:
        'Draw your signature in the box above with a mouse or your finger.',
      others: '{{names}} will sign from their own accounts.',
      deadline:
        "Once the client parties sign, the bond issuer's chief executive signs within 72 hours. If they do not, or decline it, the contract becomes void and your payment is refunded.",
    },
    coSignIntro:
      "This contract is waiting for your signature. The other parties' signatures appear on the contract.",
    declineReason: 'Reason for cancelling',
    decline: {
      decline: 'Decline the contract',
      withdraw: 'Cancel the contract',
      text: 'The contract is cancelled for every party and can no longer be signed. Make a new contract if you need one.',
    },
    facts: {
      contractNo: 'Contract number',
      amount: 'Amount',
      status: 'Status',
      signedAt: 'Confirmed on',
      deadline: 'Signing deadline',
    },
    signed: {
      title: 'Contract confirmed',
      text: 'The original, signed by every party.',
      download: 'Download PDF',
      original: 'The original contract',
      toast: 'Contract {{no}} is confirmed.',
      pdfFailed: 'Could not show the contract. Download the PDF to read it.',
      page: 'Contract page {{n}} of {{total}}',
    },
    pending: {
      checkAgain: 'Check again',
      received: 'Signature received',
      cancelled: 'Contract cancelled',
      expiredTitle: 'The signing deadline passed',
      expired: 'Not every party signed in time, so the contract is void.',
      failedTitle: 'The final copy could not be prepared',
      failed:
        'Every party has signed and the contract is numbered, but preparing its final copy failed. Our staff will check it and prepare it.',
      declinedBy: '{{who}} declined, so the contract was cancelled.',
      declinedByIssuer:
        "The bond issuer's chief executive declined the contract.",
      expiredIssuer:
        "The bond issuer's chief executive did not sign within 72 hours, so the contract is void.",
      refund: 'Your payment is refunded.',
      someParty: 'A party',
      awaitingOthers:
        "Waiting for the other parties' signatures. They sign from their own accounts. Then the bond issuer's chief executive signs within 72 hours.",
      awaitingIssuer:
        "Waiting for the bond issuer's chief executive's signature. If they do not sign by the deadline, or decline it, the contract becomes void and your payment is refunded.",
      slow: 'Preparing the final copy is taking longer than usual. Press "Check again", or check your contract list later.',
      rendering:
        'Preparing the final copy of the contract. This page updates once it is ready.',
    },
  },
  bond: {
    issuer: 'Issuer',
    rate: 'Annual rate',
    term: 'Term',
    frequency: 'Interest paid',
    currency: 'Currency',
    remaining: 'Remaining',
    soldShare: '{{share}}% sold',
    monthsRange: '{{from}}-{{to}} months',
    about: 'About',
    status: {
      draft: 'Draft',
      upcoming: 'Upcoming',
      selling: 'Active',
      paused: 'Paused',
      closed: 'Closed',
    },
    ownership: {
      individual: 'On my own',
      joint: 'With a co-holder',
    },
    list: {
      title: 'Bonds',
      description: 'Explore the bonds on offer, pick your terms and buy.',
      emptyTitle: 'No bonds yet',
      emptyText: 'New bonds appear here once published.',
    },
    options: {
      title: 'Rate options',
    },
    facts: {
      title: 'Bond details',
      total: 'Total raised',
      remaining: 'Remaining',
      minPurchase: 'Minimum purchase',
      unit: 'Price of one bond',
      cap: 'Investor cap',
      noCap: 'No cap',
      pieces_one: '{{count}} bond',
      pieces_other: '{{count}} bonds',
      sale: 'Sales period',
      saleOpen: 'From {{from}} until sold out',
      guarantee: 'Guaranteed',
    },
    prospectus: {
      title: 'Prospectus materials',
      description:
        'Open and read them here only: they cannot be downloaded or printed, and every page carries your name and register number as a watermark.',
      readOnly: 'Read only. Every page carries your name and register number.',
      view: 'View',
      pdf: 'PDF',
      image: 'Image',
      counter: '{{n}} of {{total}}',
      prev: 'Previous material',
      next: 'Next material',
      failed: 'The prospectus could not be shown.',
    },
    buy: {
      cta: 'Buy',
      title: 'Buy {{name}}',
      description:
        'Pick the rate option, the term and how many bonds, and pay. Then read and sign your contract.',
      option: 'Rate option',
      months: 'months',
      termHint: 'Between {{min}} and {{max}} months.',
      termLess: 'Shorter term',
      termMore: 'Longer term',
      quantity: 'Quantity',
      pieces: 'bonds',
      quantityHint: 'At least {{min}}, at most {{max}} bonds.',
      less: 'One less',
      more: 'One more',
      total: 'Total',
      perPiece_one: '{{count}} bond × {{price}}',
      perPiece_other: '{{count}} bonds × {{price}}',
      ownership: 'Ownership',
      sections: {
        terms: 'Rate option and term',
        termsText:
          'Choose how often interest is paid, the annual rate and the term.',
        quantity: 'Number of bonds',
        quantityText: 'One bond costs {{price}}.',
        ownership: 'Ownership',
        ownershipText:
          'Buy on your own or with a co-holder, who signs from their own account.',
      },
      errors: {
        quantityRequired: 'Enter how many bonds',
        termRequired: 'Enter the term',
        termInvalid:
          'The term is {{min}} to {{max}} months, in steps of {{step}}',
        capReached:
          'You already hold the most one investor may hold of this bond',
        quantityMin_one: 'Buy at least {{count}} bond',
        quantityMin_other: 'Buy at least {{count}} bonds',
        quantityMax_one: 'You can buy at most {{count}} bond',
        quantityMax_other: 'You can buy at most {{count}} bonds',
      },
      individualsOnlyTitle: 'Individuals only for now',
      individualsOnlyText:
        'Bond purchase contracts are open to individuals only for now.',
      notApprovedTitle: 'Your account is not approved yet',
      pendingOrderTitle: 'You have an order awaiting payment',
      pendingOrderText:
        'Pay or cancel your order of this bond before ordering again.',
      pendingOrder: 'Payment page',
      notApprovedText:
        'Once your account is approved you can buy bonds and make contracts.',
      profile: 'Profile',
      notSelling: {
        draft: 'This bond is not on sale',
        upcoming: 'Sales have not started yet',
        paused: 'Sales are paused',
        closed: 'Sales are closed',
        selling: '',
      },
      notSellingText: 'Choose a bond that is on sale.',
      noTemplateTitle: 'The contract template is not ready',
      noTemplateText:
        'You can buy this bond once its contract template is ready.',
    },
    quote: {
      title: 'Order summary',
      fill: 'Pick the rate option, the term and how many bonds.',
      tax: 'Tax on interest',
      start: 'Start date',
      maturity: 'Maturity date',
      pay: 'Pay',
      mock: 'The next step shows the account and the payment reference. Transfer within 24 hours. The repayment schedule is in the contract annex.',
      ordered: 'Order placed. Transfer the payment within 24 hours.',
    },
  },
  errors: {
    internal: 'A system error occurred. Please try again.',
    network: {
      unreachable:
        'Could not reach the server. Check your connection and try again.',
    },
    request: {
      malformed: 'The request format is invalid.',
      invalid: 'Some of the information you entered is invalid.',
      password_policy:
        'Password must be 8-128 characters and include an uppercase letter, a lowercase letter, a number and a symbol.',
      field_not_applicable:
        'A field that does not apply to your account type was sent.',
      too_large: 'The request is too large.',
      unsupported_media_type: 'This request type is not supported.',
      not_acceptable: 'The requested response type is not supported.',
      not_found: 'The requested address was not found.',
      method_not_allowed: 'This action is not allowed here.',
    },
    auth: {
      unauthenticated: 'Please sign in.',
      origin_rejected: 'Requests from this origin are not allowed.',
      invalid_credentials: 'Incorrect username or password.',
      throttled: 'Too many attempts. Please wait and try again.',
      account_locked:
        'Your account is temporarily locked after too many incorrect passwords. Please wait and try again.',
      refresh_invalid: 'Your session has expired. Please sign in again.',
      not_verified:
        'Your account is not verified yet. Request a new code to verify it.',
      already_verified: 'Your account is already verified. Please sign in.',
      reset_invalid:
        'This password reset has expired or was already used. Please start again.',
    },
    user: {
      phone_taken: 'This phone number is already registered.',
      email_taken: 'An account with this email already exists.',
      wrong_password: 'Your current password is incorrect.',
    },
    session: {
      not_found: 'Session not found or already ended.',
    },
    device: {
      not_found: 'Device not found or already removed.',
    },
    otp: {
      invalid: 'Incorrect verification code.',
      expired: 'The code has expired or was already used. Request a new one.',
      unavailable:
        'We could not send a verification code. Please wait and try again.',
    },
    issuer: {
      not_found: 'The bond issuer was not found.',
      member_not_found: 'The member was not found.',
      member_blocked: 'Your bond issuer account has been deactivated.',
    },
    client: {
      blocked: 'Your account has been blocked.',
      register_taken:
        'An account with this registration number already exists.',
      passport_taken: 'An account with this passport number already exists.',
      org_name_taken: 'An organization with this name is already registered.',
      not_organization: 'Only an organization can do this.',
      member_not_found: 'Officer not found.',
      remove_self: 'You cannot remove yourself from the organization.',
      iban_invalid: 'This IBAN is not valid. Please check it.',
      iban_mismatch: 'The account number does not match the IBAN.',
      phone_invalid:
        "This number does not fit the selected country's phone numbers.",
      not_approved:
        'Your account is not verified yet. You can use this once our team has verified it.',
      profile_locked:
        'Name, registration number, passport and officer details of a verified account cannot be changed.',
    },
    bank: {
      account_not_found:
        'No bank account is registered. Please register your account first.',
      account_exists: 'An account with this IBAN is already registered.',
      account_last:
        'The last account cannot be removed. Add another account first.',
      verification_mismatch:
        "The name in the bank's record does not match the account holder's name you registered.",
      account_lookup_not_found:
        'The bank does not know this account. Check the account number and IBAN.',
      unavailable: 'Could not reach the bank. Please wait and try again.',
      not_configured:
        'The bank connection is not set up. Please contact an administrator.',
    },
    contract: {
      not_found: 'Contract not found.',
      no_active_template:
        'No active template is assigned to this bond and ownership type.',
      template_unsupported: 'A contract cannot be made from this template.',
      template_not_found: 'Contract template not found.',
      template_changed:
        'The contract template was updated. Read the contract again, then sign it.',
      parties_mismatch:
        'The contract parties do not match the template: each party it needs must appear exactly once.',
      signature_invalid: 'The signature must be a PNG image under 512 KB.',
      co_holder_invalid:
        'A product with a co-holder needs their register (or passport) and phone numbers; other products take none.',
      co_holder_not_found:
        'Co-holder not found. Check the register (or passport) and phone numbers: they must be an approved client other than you.',
      not_pending:
        'This contract is not awaiting signatures: every party has signed, it was cancelled, or its signing time ran out.',
      already_signed: 'You have already signed this contract.',
      not_signer: 'This contract does not need your signature.',
      request_conflict:
        'A different contract was stored for this request. Reload the page and try again.',
      document_not_ready: 'The final contract document is not ready yet.',
      holder_unsupported:
        'For now only approved individuals with a register or passport number and a bank account can make a contract.',
      paid: 'A paid contract cannot be cancelled.',
      payment_pending:
        'You have an order of this bond awaiting payment. Pay or cancel it, then order again.',
      payment_account_missing:
        'No company account is registered to receive payments in this currency.',
      not_awaiting_payment:
        'This order no longer awaits payment: it was paid, cancelled or lapsed.',
      mock_payment_disabled: 'The test payment is off here.',
      director_only:
        "Only the issuer's chief executive signs or declines its contracts.",
      decline_reason_required: 'Write why you decline the contract.',
    },
    bond: {
      not_found: 'Bond not found.',
      not_selling: 'This bond is not on sale now.',
      term_invalid: 'The chosen term does not fit the rate option.',
      amount_invalid:
        'The amount must be at least the minimum and a multiple of the purchase unit.',
      amount_exceeds_remaining:
        "The amount exceeds the bond's remaining amount.",
      remainder_too_small:
        'The amount left after this purchase would be below the minimum purchase.',
      investor_cap_exceeded: 'This exceeds the cap per investor.',
      rate_option_not_found: 'Rate option not found.',
      file_not_found: 'File not found.',
    },
  },
};
