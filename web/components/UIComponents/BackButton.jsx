import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";

function BackButton() {
  const router = useRouter();
  return (
    <IconButton
      aria-label="Go back"
      icon={<ArrowBackIcon />}
      onClick={() => router.back()}
    />
  );
}

export default BackButton;