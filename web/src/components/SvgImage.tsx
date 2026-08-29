import { Image, type ImageProps } from "@chakra-ui/react";

type SvgImageProps = Omit<ImageProps, "alt" | "aria-hidden" | "src"> & {
  src: string;
};

export function SvgImage({ src, ...props }: SvgImageProps) {
  return <Image src={src} alt="" aria-hidden="true" {...props} />;
}
