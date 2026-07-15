import { GeneratorBlueprint } from "@/lib/types";
import { imageBlueprint } from "@/lib/generators/image";
import { videoBlueprint } from "@/lib/generators/video";
import { captionBlueprint } from "@/lib/generators/caption";
import { pollBlueprint } from "@/lib/generators/poll";
import { storyBlueprint } from "@/lib/generators/story";
import { replyBlueprint } from "@/lib/generators/reply";
import { productDescriptionBlueprint } from "@/lib/generators/product-description";

export const GENERATOR_REGISTRY: Record<string, GeneratorBlueprint> = {
  image: imageBlueprint,
  video: videoBlueprint,
  caption: captionBlueprint,
  poll: pollBlueprint,
  story: storyBlueprint,
  reply: replyBlueprint,
  "product-description": productDescriptionBlueprint,
};

export function getBlueprint(slug: string): GeneratorBlueprint | undefined {
  return GENERATOR_REGISTRY[slug];
}
