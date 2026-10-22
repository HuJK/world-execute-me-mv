"""Build the renderer's timing data from the analysis outputs.
  work/audio_analysis.json (analyze_audio.py) + work/lyrics_words.json (align_words.py)
  -> studio/src/data/{lyrics,beats,env}.json
usage: python build_data.py [root]"""
import json, os, sys
root = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
W = lambda *p: os.path.join(root, *p)
a = json.load(open(W('work', 'audio_analysis.json')))
w = json.load(open(W('work', 'lyrics_words.json')))
for c in w:
    # manual fixes checked against the vocal stem
    if c['text'].startswith('world.execute'):
        c['start'] = 15.55; c['end'] = 23.08
        c['words'] = [{'w': 'world', 's': 15.58, 'e': 15.95}, {'w': '.execute', 's': 16.02, 'e': 16.5},
                      {'w': '(me)', 's': 16.55, 'e': 16.85}, {'w': ';', 's': 16.86, 'e': 17.0}]
    if c['text'] == 'If I can' and abs(c['start'] - 59.223) < 0.01:
        c['words'] = [{'w': 'If', 's': 59.22, 'e': 59.35}, {'w': 'I', 's': 59.35, 'e': 59.5}, {'w': 'can', 's': 59.5, 'e': 59.69}]
json.dump(w, open(W('studio', 'src', 'data', 'lyrics.json'), 'w'))
json.dump({k: a[k] for k in ['duration', 'fps', 'bpm', 'beats', 'downbeats', 'onsets', 'kicks']}, open(W('studio', 'src', 'data', 'beats.json'), 'w'))
json.dump({k: a[k] for k in ['rms', 'low', 'mid', 'high', 'onsetEnv']}, open(W('studio', 'src', 'data', 'env.json'), 'w'))
print(len(w), 'cues')
