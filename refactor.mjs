/**
 * @fileoverview
 * I extracted all the conditional statements to their own pure functions for ease of maintenance, testing and debugging. 
 * The functions have clear descriptive names to clearly communicate the purpose of each function. 
 * I also added type definitions for type-checking and code documentation.
 * I used the import/export syntax from esm modules, ternary operators and optional chaining because they are modern ecmascript syntax and clearly descriptive in their purpose.
 * The refactor is clearer and easier to read than the original implementation.
 */
import { createHash } from 'crypto';

/**
 * It generates the hash of the input data
 * @param {object|string} data Data to be hashed
 * @returns {string}  sha3-512 hash of the data
 */
export const getHash = data => {
	if (!data) throw new Error("Wrong input: expected a string or an object");

	if (typeof data !== "string") {
		data = JSON.stringify(data);
	}

	const hash = createHash("sha3-512").update(data).digest("hex");
	return hash;
}

/**
 * @param {{partitionKey?: string, [key: string]: any}} event 
 * @returns {string} The stringified hash of the event object
 */
export const getCandidateFromEvent = event => {
	if (!event) throw Error("Wrong input: expected an event object");

	const candidate = event?.partitionKey ?? getHash(event);
	return candidate;
}

/**
 * Computes the hash of the candidate if it is greater than the MAX_PARTITION_KEY_LENGTH of 256
 * @param {string} candidate 
 * @returns {string}
 */
export const shortenCandidateLength = candidate => {
	if (!candidate) throw Error("Wrong input: expected a string");

	const MAX_PARTITION_KEY_LENGTH = 256;
	if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
		return getHash(candidate);
	}

	return candidate;
}

/**
 * @param {{partitionKey?: string, [key: string]: any}} event 
 * @returns {string} deterministic partition key of an event
 */
export const deterministicPartitionKey = (event) => {
	const TRIVIAL_PARTITION_KEY = "0";
	const candidate = event ? getCandidateFromEvent(event) : TRIVIAL_PARTITION_KEY;
	const key = shortenCandidateLength(candidate);
	return key;
};