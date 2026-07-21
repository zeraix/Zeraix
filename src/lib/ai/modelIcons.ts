/**
 * Brand icons for the Model Library.
 *
 * Every model surface (catalog cards, installed community models, Hub search results, the two
 * dialogs) shows the logo of the family that produced the weights. The catalog has fixed ids, but
 * the Browse tab lists arbitrary `owner/repo` GGUF repos, so the brand is *inferred* from the name
 * rather than looked up: the repo owner is usually a quantizer (unsloth, bartowski, mradermacher,
 * lmstudio-community, …), not the model author, so the repo's last path segment is matched first
 * and only then the whole string.
 *
 * Assets live in `public/model-icons/` and were vendored from @lobehub/icons-static-svg (MIT).
 * They are plain <img> sources, so `currentColor` was pinned to black at vendoring time; ModelIcon
 * renders them on a light chip in both themes rather than trying to recolor them.
 */

type Brand = { key: string; match: RegExp };

/** First match wins — keep the specific patterns above the generic ones. */
const BRANDS: Brand[] = [
  { key: "qwen", match: /qwen|qwq|qvq/ },
  { key: "deepseek", match: /deepseek/ },
  { key: "gemma", match: /gemma/ },
  { key: "gemini", match: /gemini/ },
  { key: "claude", match: /claude/ },
  { key: "openai", match: /gpt-?oss|openai|\bgpt-?[0-9]/ },
  { key: "grok", match: /grok|\bxai\b/ },
  { key: "nvidia", match: /nemotron|nvidia|\bnvlm/ },
  { key: "meta", match: /llama(?!index)|metaai/ },
  { key: "mistral", match: /mistral|mixtral|codestral|ministral|magistral|devstral|pixtral|voxtral/ },
  { key: "microsoft", match: /\bphi-?\d|\bphi-?(mini|small|medium|moe)|wizardlm|orca|\bmicrosoft\b/ },
  { key: "minimax", match: /minimax/ },
  { key: "kimi", match: /kimi/ },
  { key: "moonshot", match: /moonshot/ },
  { key: "chatglm", match: /chatglm|\bglm-?\d|glm-?[45]/ },
  { key: "zhipu", match: /zhipu/ },
  { key: "yi", match: /\byi-\d|01-ai|yi-coder|yi-lightning/ },
  { key: "internlm", match: /internlm|intern-?s\d|intern-?vl/ },
  { key: "baichuan", match: /baichuan/ },
  { key: "hunyuan", match: /hunyuan/ },
  { key: "doubao", match: /doubao/ },
  { key: "bytedance", match: /bytedance|seed-?oss|seed-?coder/ },
  { key: "baidu", match: /ernie|\bbaidu/ },
  { key: "ibm", match: /granite/ },
  { key: "ai2", match: /\bolmo|molmo|\btulu|\ballenai\b/ },
  { key: "lg", match: /exaone/ },
  { key: "tii", match: /falcon/ },
  { key: "aya", match: /\baya-/ },
  { key: "commanda", match: /command-?[ar]\b|command-?r7b/ },
  { key: "cohere", match: /cohere/ },
  { key: "upstage", match: /solar-?(pro|mini|\d)/ },
  { key: "ai21", match: /jamba|ai21/ },
  { key: "stability", match: /stable-?(lm|code|diffusion)|stability/ },
  { key: "rwkv", match: /rwkv/ },
  { key: "nousresearch", match: /\bnous\b|hermes/ },
  { key: "openchat", match: /openchat/ },
  { key: "jina", match: /jina/ },
  { key: "perplexity", match: /perplexity|r1-?1776/ },
  { key: "tencent", match: /tencent/ },
  { key: "phind", match: /phind/ },
  { key: "ollama", match: /ollama/ },
  { key: "huggingface", match: /smol(lm|vlm)|huggingface|\bhf\b|zephyr/ },
];

/** Hugging Face is the fallback: everything in the Browse tab comes from the Hub. */
const FALLBACK: Brand = { key: "huggingface", match: /(?:)/ };

export type ModelIcon = { src: string };

const pick = (haystack: string): Brand | null => BRANDS.find((b) => b.match.test(haystack)) ?? null;

/**
 * Resolve the brand icon for a model. Pass anything identifying: a catalog id/name
 * ("qwen3.6-35b-a3b"), a repo ("unsloth/Qwen3.6-35B-A3B-GGUF"), or both.
 */
export function modelIcon(...hints: (string | undefined | null)[]): ModelIcon {
  // `_` separates the original org from the model in re-uploaded repos ("bartowski/microsoft_Phi-4-…"),
  // so normalise it to a space and let the \b anchors below see those words.
  const parts = hints.filter(Boolean).map((h) => String(h).toLowerCase().replace(/_+/g, " "));
  // Repo owners are usually quantizers, so try the model-name segment before the full string.
  const tails = parts.map((p) => p.split("/").pop() ?? p);
  const brand = pick(tails.join(" ")) ?? pick(parts.join(" ")) ?? FALLBACK;
  return { src: `/model-icons/${brand.key}.svg` };
}
