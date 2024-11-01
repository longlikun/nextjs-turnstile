interface Window {
    turnstile: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          theme?: string;
          language?: string;
        }
      ) => void;
      remove: (element: HTMLElement) => void;
    };
  }