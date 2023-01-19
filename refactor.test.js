import {
	getHash,
	getCandidateFromEvent,
	shortenCandidateLength,
	deterministicPartitionKey
} from "./refactor.mjs";
import original from "./refactor.cjs";

const event = {
	partitionKey: "5",
	dummyField: "dummyValue",
}

const eventWithoutPartitionKey = {
	dummyField: "dummyValue"
}

const input = "dummy";
const outputForEvent = "9624354fb5c52ee12dca2c1794003afcb8c2a150148bbe84f85f1ec608354f94f9fca96a59ad22e028ecb5f47d593da65c5fd77f281264e7fc970a7c2da705cc";
const outputForEventWithoutPartitionKey = "4a67e09091a03f994cc0cfb12ddc9321daf89aab5f87be34157a7db8c8c7bfa99752a776fae60fed1f784407d962e70af8e517d967c9ad0edcdd1c7a3aa8a4c7";

describe("deterministicPartitionKey", () => {
	test("getHash should throw an error when it receives no input", () => {
		expect(() => getHash()).toThrowError("Wrong input: expected a string or an object")
	})

	test("getHash should return a hex string", () => {
		expect(typeof getHash(input)).toBe("string")
		expect(getHash(input)).toBe(outputForEvent)
	})

	test("getCandidateFromEvent should throw an error when it receives no input", () => {
		expect(() => getCandidateFromEvent()).toThrowError("Wrong input: expected an event object")
	})

	test("getCandidateFromEvent should compute the candidate from an event", () => {
		expect(typeof getCandidateFromEvent(event)).toBe("string")
		expect(getCandidateFromEvent(event)).toBe("5")
	})

	test("getCandidateFromEvent should compute the candidate from an event", () => {
		expect(typeof getCandidateFromEvent(eventWithoutPartitionKey)).toBe("string")
		expect(getCandidateFromEvent(eventWithoutPartitionKey)).toBe(outputForEventWithoutPartitionKey)
	})

	test("shortenCandidateLength should throw an error when it receives no input", () => {
		expect(() => shortenCandidateLength()).toThrowError("Wrong input: expected a string")
	})

	test("shortenCandidateLength should shorten a hex/string longer than 256", () => {
		const candidate = getCandidateFromEvent(event);
		const candidateWithoutPartitionKey = getCandidateFromEvent(eventWithoutPartitionKey);
		expect(typeof shortenCandidateLength(candidate)).toBe("string")
		expect(shortenCandidateLength(candidate)).toBe("5")
		expect(shortenCandidateLength(candidateWithoutPartitionKey)).toBe(outputForEventWithoutPartitionKey)
	})

	test("deterministicPartitionKey should return a hash key", () => {
		expect(deterministicPartitionKey(null)).toBe("0")
	})

	test("deterministicPartitionKey should return a hash key", () => {
		expect(typeof deterministicPartitionKey(event)).toBe("string")
		expect(deterministicPartitionKey(event)).toBe("5")
		expect(original.deterministicPartitionKey(event)).toBe("5")
		expect(deterministicPartitionKey(eventWithoutPartitionKey)).toBe(outputForEventWithoutPartitionKey)
	})

	test("that refactor does not break the original function", () => {
		const randomEvent = {
			dummyField: Math.random().toString(),
			randomValue: Math.random().toString()
		}
		expect(original.deterministicPartitionKey(event)).toBe(deterministicPartitionKey(event))
		expect(original.deterministicPartitionKey(randomEvent)).toBe(deterministicPartitionKey(randomEvent))
		expect(original.deterministicPartitionKey(eventWithoutPartitionKey)).toBe(deterministicPartitionKey(eventWithoutPartitionKey))
	})
})