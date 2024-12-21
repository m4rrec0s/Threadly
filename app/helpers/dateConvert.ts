function dateConvert(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks} semana${weeks > 1 ? "s" : ""} atrás`;
  } else if (days > 0) {
    return `${days} dia${days > 1 ? "s" : ""} atrás`;
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
  } else if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? "s" : ""} atrás`;
  } else {
    return `agora mesmo`;
  }
}

export { dateConvert };
