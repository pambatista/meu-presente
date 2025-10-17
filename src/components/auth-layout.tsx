import { Gift } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium text-sm">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Gift className="size-4" />
            </div>
            Meu Presente.
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background relative hidden lg:flex items-center justify-center overflow-hidden">
        <svg
          className="w-full h-full absolute inset-0"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Formas fluidas de fundo */}
          <g opacity="0.35">
            <path
              d="M400 100C500 100 600 150 650 250C700 350 680 450 600 520C520 590 420 610 320 580C220 550 150 480 130 380C110 280 150 180 250 130C300 105 350 100 400 100Z"
              fill="url(#gradient1)"
              className="animate-[morph_12s_ease-in-out_infinite]"
            />
            <path
              d="M350 200C420 180 490 200 540 260C590 320 600 400 560 470C520 540 450 580 370 570C290 560 230 510 210 440C190 370 220 290 280 240C310 215 330 205 350 200Z"
              fill="url(#gradient2)"
              className="animate-[morph2_15s_ease-in-out_infinite]"
            />
          </g>

          {/* Círculos decorativos grandes */}
          <circle
            cx="150"
            cy="150"
            r="50"
            fill="url(#gradient3)"
            opacity="0.25"
            className="animate-[float_6s_ease-in-out_infinite]"
          />
          <circle
            cx="650"
            cy="650"
            r="60"
            fill="url(#gradient4)"
            opacity="0.25"
            className="animate-[float_8s_ease-in-out_infinite_1s]"
          />
          <circle
            cx="700"
            cy="200"
            r="35"
            fill="url(#gradient5)"
            opacity="0.2"
            className="animate-[float_7s_ease-in-out_infinite_2s]"
          />
          <circle
            cx="100"
            cy="700"
            r="40"
            fill="url(#gradient6)"
            opacity="0.2"
            className="animate-[float_9s_ease-in-out_infinite_3s]"
          />

          {/* Bolas menores */}
          <circle
            cx="250"
            cy="100"
            r="15"
            fill="url(#gradient3)"
            opacity="0.3"
            className="animate-[float_5s_ease-in-out_infinite]"
          />
          <circle
            cx="550"
            cy="150"
            r="20"
            fill="url(#gradient4)"
            opacity="0.25"
            className="animate-[float_6s_ease-in-out_infinite_1s]"
          />
          <circle
            cx="750"
            cy="450"
            r="12"
            fill="url(#gradient5)"
            opacity="0.3"
            className="animate-[float_7s_ease-in-out_infinite_2s]"
          />
          <circle
            cx="50"
            cy="400"
            r="18"
            fill="url(#gradient6)"
            opacity="0.25"
            className="animate-[float_8s_ease-in-out_infinite_3s]"
          />
          <circle
            cx="650"
            cy="100"
            r="10"
            fill="url(#gradient1)"
            opacity="0.3"
            className="animate-[float_5.5s_ease-in-out_infinite_1.5s]"
          />
          <circle
            cx="150"
            cy="550"
            r="14"
            fill="url(#gradient2)"
            opacity="0.25"
            className="animate-[float_6.5s_ease-in-out_infinite_2.5s]"
          />
          <circle
            cx="500"
            cy="700"
            r="16"
            fill="url(#gradient3)"
            opacity="0.3"
            className="animate-[float_7.5s_ease-in-out_infinite]"
          />
          <circle
            cx="300"
            cy="650"
            r="11"
            fill="url(#gradient4)"
            opacity="0.25"
            className="animate-[float_8.5s_ease-in-out_infinite_1s]"
          />

          {/* Gradientes */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor="hsl(293, 69%, 49%)"
                stopOpacity="0.8"
              />
              <stop
                offset="100%"
                stopColor="hsl(280, 69%, 60%)"
                stopOpacity="0.4"
              />
            </linearGradient>
            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor="hsl(270, 69%, 55%)"
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor="hsl(290, 69%, 65%)"
                stopOpacity="0.3"
              />
            </linearGradient>
            <radialGradient id="gradient3">
              <stop
                offset="0%"
                stopColor="hsl(293, 69%, 49%)"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="hsl(293, 69%, 49%)"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient id="gradient4">
              <stop
                offset="0%"
                stopColor="hsl(280, 69%, 60%)"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="hsl(280, 69%, 60%)"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient id="gradient5">
              <stop
                offset="0%"
                stopColor="hsl(270, 69%, 55%)"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="hsl(270, 69%, 55%)"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient id="gradient6">
              <stop
                offset="0%"
                stopColor="hsl(290, 69%, 65%)"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="hsl(290, 69%, 65%)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>
        </svg>

        {/* Ícone Gift centralizado */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Gift className="w-20 h-20 text-white" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
